import { Router } from 'express';
import { z } from 'zod';
import { IStorage } from '../storage';

const router = Router();

// Schema for change request
const changeRequestSchema = z.object({
  targetType: z.enum(['component', 'workorder', 'spare', 'store']),
  targetId: z.string(),
  targetPath: z.string(),
  modifyModeVersion: z.number().default(1),
  original: z.any(),
  proposed: z.any(),
  diff: z.object({
    fields: z.array(z.object({
      key: z.string(),
      from: z.any(),
      to: z.any()
    })).optional(),
    rows: z.object({
      added: z.array(z.any()).optional(),
      deleted: z.array(z.any()).optional(),
      changed: z.array(z.any()).optional()
    }).optional()
  }),
  submittedBy: z.string(),
  submittedAt: z.string(),
  status: z.enum(['Pending', 'Approved', 'Rejected', 'Returned']).default('Pending')
});

export default function changeRequestsRoutes(storage: any) {
  // Create a new change request
  router.post('/', async (req, res) => {
    try {
      const validatedData = changeRequestSchema.parse(req.body);
      
      // Generate title based on target type and ID
      const title = `${validatedData.targetType.charAt(0).toUpperCase() + validatedData.targetType.slice(1)} ${validatedData.targetPath} – Proposed edits`;
      
      // Count the number of changes
      const fieldChanges = validatedData.diff.fields?.length || 0;
      const rowChanges = 
        (validatedData.diff.rows?.added?.length || 0) +
        (validatedData.diff.rows?.deleted?.length || 0) +
        (validatedData.diff.rows?.changed?.length || 0);
      const diffSummaryCount = fieldChanges + rowChanges;
      
      const changeRequest = {
        id: crypto.randomUUID(),
        ...validatedData,
        title,
        diffSummaryCount,
        submittedAt: new Date().toISOString()
      };
      
      // Store the change request using existing createChangeRequest method
      const created = await storage.createChangeRequest({
        vesselId: 'vessel1',
        category: 'modify_pms',
        title: changeRequest.title,
        priority: 'medium',
        requestedByUserId: changeRequest.submittedBy,
        targetType: changeRequest.targetType,
        targetId: changeRequest.targetId,
        snapshotBeforeJson: changeRequest.original,
        proposedChangesJson: changeRequest.proposed,
        movePreviewJson: changeRequest.diff,
        status: 'submitted'
      });
      res.json({
        ...created,
        diffSummaryCount: changeRequest.diffSummaryCount
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create change request' });
      }
    }
  });
  
  // Get change requests with optional filters
  router.get('/', async (req, res) => {
    try {
      const { status, targetType } = req.query;
      
      const filters: any = {};
      if (status) filters.status = status;
      if (targetType) filters.targetType = targetType;
      
      const requests = await storage.getChangeRequests(filters);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch change requests' });
    }
  });
  
  // Get a specific change request
  router.get('/:id', async (req, res) => {
    try {
      const request = await storage.getChangeRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ error: 'Change request not found' });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch change request' });
    }
  });
  
  // Update change request status
  router.patch('/:id/status', async (req, res) => {
    try {
      const { status, reviewerId, comment } = req.body;
      const id = parseInt(req.params.id);
      
      let updated;
      switch(status) {
        case 'Approved':
          updated = await storage.approveChangeRequest(id, reviewerId || 'reviewer', comment || 'Approved');
          break;
        case 'Rejected':
          updated = await storage.rejectChangeRequest(id, reviewerId || 'reviewer', comment || 'Rejected');
          break;
        case 'Returned':
          updated = await storage.returnChangeRequest(id, reviewerId || 'reviewer', comment || 'Returned for clarification');
          break;
        default:
          return res.status(400).json({ error: 'Invalid status' });
      }
      
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update change request status' });
    }
  });
  
  return router;
}