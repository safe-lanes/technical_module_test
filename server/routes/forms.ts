import { Router } from 'express';
import { storage } from '../storage';
import { z } from 'zod';
import { insertFormVersionSchema } from '@shared/schema';

const router = Router();

// Seed forms from live schemas
router.post('/admin/forms/seed-from-live', async (req, res) => {
  try {
    // Seed if not already present
    if (storage.seedForms) {
      await storage.seedForms();
    }
    res.json({ ok: true, message: 'Forms seeded successfully' });
  } catch (error) {
    console.error('Error seeding forms:', error);
    res.status(500).json({ error: 'Failed to seed forms' });
  }
});

// List all form definitions with latest version info
router.get('/admin/forms', async (req, res) => {
  try {
    let forms = await storage.getFormDefinitions();

    // Auto-seed if no forms exist
    if (forms.length === 0) {
      await storage.seedForms();
      forms = await storage.getFormDefinitions();
    }

    // Get latest version for each form
    const formsWithVersions = await Promise.all(
      forms.map(async form => {
        const latestVersion = await storage.getLatestPublishedVersion(form.id);
        return {
          ...form,
          versionNo: latestVersion?.versionNo || 0,
          versionDate: latestVersion?.versionDate || null,
          status: latestVersion?.status || 'NO_VERSION',
        };
      })
    );

    res.json(formsWithVersions);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all versions for a form
router.get('/admin/forms/:formId/versions', async (req, res) => {
  try {
    const formId = parseInt(req.params.formId);
    const versions = await storage.getFormVersions(formId);
    res.json(versions);
  } catch (error) {
    console.error('Error fetching form versions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific version
router.get('/admin/forms/:formId/versions/:versionId', async (req, res) => {
  try {
    const versionId = parseInt(req.params.versionId);
    const version = await storage.getFormVersion(versionId);

    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }

    res.json(version);
  } catch (error) {
    console.error('Error fetching form version:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new draft version (clone from latest published)
router.post('/admin/forms/:formId/versions', async (req, res) => {
  try {
    const formId = parseInt(req.params.formId);

    // Get latest published version to clone
    const latestPublished = await storage.getLatestPublishedVersion(formId);

    if (!latestPublished) {
      return res
        .status(404)
        .json({ error: 'No published version found to clone' });
    }

    // Check if draft already exists
    const existingVersions = await storage.getFormVersions(formId);
    const existingDraft = existingVersions.find(v => v.status === 'DRAFT');

    if (existingDraft) {
      return res.status(400).json({ error: 'Draft version already exists' });
    }

    // Create new draft
    const newVersion = await storage.createFormVersion({
      formId,
      versionNo: latestPublished.versionNo + 1,
      versionDate: new Date(),
      status: 'DRAFT',
      authorUserId: req.body.userId || 'user',
      changelog: null,
      schemaJson: latestPublished.schemaJson,
    });

    res.json(newVersion);
  } catch (error) {
    console.error('Error creating draft version:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update draft schema
router.put(
  '/admin/forms/:formId/versions/:versionId/schema',
  async (req, res) => {
    try {
      const versionId = parseInt(req.params.versionId);
      const { schemaJson } = req.body;

      if (!schemaJson) {
        return res.status(400).json({ error: 'Schema JSON is required' });
      }

      const updated = await storage.updateFormVersion(versionId, {
        schemaJson:
          typeof schemaJson === 'string'
            ? schemaJson
            : JSON.stringify(schemaJson),
      });

      res.json(updated);
    } catch (error: any) {
      console.error('Error updating form schema:', error);
      if (error.message === 'Can only update draft versions') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Publish version
router.post(
  '/admin/forms/:formId/versions/:versionId/publish',
  async (req, res) => {
    try {
      const versionId = parseInt(req.params.versionId);
      const { userId, changelog } = req.body;

      if (!changelog) {
        return res.status(400).json({ error: 'Changelog is required' });
      }

      const published = await storage.publishFormVersion(
        versionId,
        userId || 'user',
        changelog
      );

      res.json(published);
    } catch (error: any) {
      console.error('Error publishing form version:', error);
      if (error.message.includes('Can only publish')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Discard draft
router.post(
  '/admin/forms/:formId/versions/:versionId/discard',
  async (req, res) => {
    try {
      const versionId = parseInt(req.params.versionId);
      await storage.discardFormVersion(versionId);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error discarding form version:', error);
      if (error.message.includes('Can only discard')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Rollback to previous version (create new draft from old version)
router.post(
  '/admin/forms/:formId/versions/:versionId/rollback',
  async (req, res) => {
    try {
      const formId = parseInt(req.params.formId);
      const versionId = parseInt(req.params.versionId);

      // Get the version to rollback to
      const sourceVersion = await storage.getFormVersion(versionId);

      if (!sourceVersion) {
        return res.status(404).json({ error: 'Version not found' });
      }

      // Check if draft already exists
      const existingVersions = await storage.getFormVersions(formId);
      const existingDraft = existingVersions.find(v => v.status === 'DRAFT');

      if (existingDraft) {
        return res.status(400).json({ error: 'Draft version already exists' });
      }

      // Get latest version number
      const latestVersion = existingVersions[0];
      const newVersionNo = latestVersion ? latestVersion.versionNo + 1 : 1;

      // Create new draft from source version
      const newDraft = await storage.createFormVersion({
        formId,
        versionNo: newVersionNo,
        versionDate: new Date(),
        status: 'DRAFT',
        authorUserId: req.body.userId || 'user',
        changelog: `Rollback from version ${sourceVersion.versionNo}`,
        schemaJson: sourceVersion.schemaJson,
      });

      res.json(newDraft);
    } catch (error) {
      console.error('Error rolling back form version:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Runtime endpoint - get latest published schema for operational use
router.get('/forms/runtime/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const version = await storage.getLatestPublishedVersionByName(name);

    if (!version) {
      return res.status(404).json({ error: 'No published version found' });
    }

    // Track usage
    await storage.createFormVersionUsage({
      formVersionId: version.id,
      usedInModule: (req.headers['x-module'] as string) || 'unknown',
      usedAt: new Date(),
    });

    res.json({
      versionId: version.id,
      versionNo: version.versionNo,
      schema: JSON.parse(version.schemaJson),
    });
  } catch (error) {
    console.error('Error fetching runtime form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
