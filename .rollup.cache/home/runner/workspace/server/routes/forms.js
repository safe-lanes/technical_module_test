import { __assign, __awaiter, __generator } from 'tslib';
import { Router } from 'express';
import { storage } from '../storage';
var router = Router();
// Seed forms from live schemas
router.post('/admin/forms/seed-from-live', function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3, , 4]);
          if (!storage.seedForms) return [3 /*break*/, 2];
          return [4 /*yield*/, storage.seedForms()];
        case 1:
          _a.sent();
          _a.label = 2;
        case 2:
          res.json({ ok: true, message: 'Forms seeded successfully' });
          return [3 /*break*/, 4];
        case 3:
          error_1 = _a.sent();
          console.error('Error seeding forms:', error_1);
          res.status(500).json({ error: 'Failed to seed forms' });
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
});
// List all form definitions with latest version info
router.get('/admin/forms', function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var forms, formsWithVersions, error_2;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 6, , 7]);
          return [4 /*yield*/, storage.getFormDefinitions()];
        case 1:
          forms = _a.sent();
          if (!(forms.length === 0)) return [3 /*break*/, 4];
          return [4 /*yield*/, storage.seedForms()];
        case 2:
          _a.sent();
          return [4 /*yield*/, storage.getFormDefinitions()];
        case 3:
          forms = _a.sent();
          _a.label = 4;
        case 4:
          return [
            4 /*yield*/,
            Promise.all(
              forms.map(function (form) {
                return __awaiter(void 0, void 0, void 0, function () {
                  var latestVersion;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [
                          4 /*yield*/,
                          storage.getLatestPublishedVersion(form.id),
                        ];
                      case 1:
                        latestVersion = _a.sent();
                        return [
                          2 /*return*/,
                          __assign(__assign({}, form), {
                            versionNo:
                              (latestVersion === null ||
                              latestVersion === void 0
                                ? void 0
                                : latestVersion.versionNo) || 0,
                            versionDate:
                              (latestVersion === null ||
                              latestVersion === void 0
                                ? void 0
                                : latestVersion.versionDate) || null,
                            status:
                              (latestVersion === null ||
                              latestVersion === void 0
                                ? void 0
                                : latestVersion.status) || 'NO_VERSION',
                          }),
                        ];
                    }
                  });
                });
              })
            ),
          ];
        case 5:
          formsWithVersions = _a.sent();
          res.json(formsWithVersions);
          return [3 /*break*/, 7];
        case 6:
          error_2 = _a.sent();
          console.error('Error fetching forms:', error_2);
          res.status(500).json({ error: 'Internal server error' });
          return [3 /*break*/, 7];
        case 7:
          return [2 /*return*/];
      }
    });
  });
});
// Get all versions for a form
router.get('/admin/forms/:formId/versions', function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var formId, versions, error_3;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          formId = parseInt(req.params.formId);
          return [4 /*yield*/, storage.getFormVersions(formId)];
        case 1:
          versions = _a.sent();
          res.json(versions);
          return [3 /*break*/, 3];
        case 2:
          error_3 = _a.sent();
          console.error('Error fetching form versions:', error_3);
          res.status(500).json({ error: 'Internal server error' });
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
});
// Get specific version
router.get('/admin/forms/:formId/versions/:versionId', function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var versionId, version, error_4;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          versionId = parseInt(req.params.versionId);
          return [4 /*yield*/, storage.getFormVersion(versionId)];
        case 1:
          version = _a.sent();
          if (!version) {
            return [
              2 /*return*/,
              res.status(404).json({ error: 'Version not found' }),
            ];
          }
          res.json(version);
          return [3 /*break*/, 3];
        case 2:
          error_4 = _a.sent();
          console.error('Error fetching form version:', error_4);
          res.status(500).json({ error: 'Internal server error' });
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
});
// Create new draft version (clone from latest published)
router.post('/admin/forms/:formId/versions', function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var formId,
      latestPublished,
      existingVersions,
      existingDraft,
      newVersion,
      error_5;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 4, , 5]);
          formId = parseInt(req.params.formId);
          return [4 /*yield*/, storage.getLatestPublishedVersion(formId)];
        case 1:
          latestPublished = _a.sent();
          if (!latestPublished) {
            return [
              2 /*return*/,
              res
                .status(404)
                .json({ error: 'No published version found to clone' }),
            ];
          }
          return [4 /*yield*/, storage.getFormVersions(formId)];
        case 2:
          existingVersions = _a.sent();
          existingDraft = existingVersions.find(function (v) {
            return v.status === 'DRAFT';
          });
          if (existingDraft) {
            return [
              2 /*return*/,
              res.status(400).json({ error: 'Draft version already exists' }),
            ];
          }
          return [
            4 /*yield*/,
            storage.createFormVersion({
              formId: formId,
              versionNo: latestPublished.versionNo + 1,
              versionDate: new Date(),
              status: 'DRAFT',
              authorUserId: req.body.userId || 'user',
              changelog: null,
              schemaJson: latestPublished.schemaJson,
            }),
          ];
        case 3:
          newVersion = _a.sent();
          res.json(newVersion);
          return [3 /*break*/, 5];
        case 4:
          error_5 = _a.sent();
          console.error('Error creating draft version:', error_5);
          res.status(500).json({ error: 'Internal server error' });
          return [3 /*break*/, 5];
        case 5:
          return [2 /*return*/];
      }
    });
  });
});
// Update draft schema
router.put(
  '/admin/forms/:formId/versions/:versionId/schema',
  function (req, res) {
    return __awaiter(void 0, void 0, void 0, function () {
      var versionId, schemaJson, updated, error_6;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            versionId = parseInt(req.params.versionId);
            schemaJson = req.body.schemaJson;
            if (!schemaJson) {
              return [
                2 /*return*/,
                res.status(400).json({ error: 'Schema JSON is required' }),
              ];
            }
            return [
              4 /*yield*/,
              storage.updateFormVersion(versionId, {
                schemaJson:
                  typeof schemaJson === 'string'
                    ? schemaJson
                    : JSON.stringify(schemaJson),
              }),
            ];
          case 1:
            updated = _a.sent();
            res.json(updated);
            return [3 /*break*/, 3];
          case 2:
            error_6 = _a.sent();
            console.error('Error updating form schema:', error_6);
            if (error_6.message === 'Can only update draft versions') {
              return [
                2 /*return*/,
                res.status(400).json({ error: error_6.message }),
              ];
            }
            res.status(500).json({ error: 'Internal server error' });
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  }
);
// Publish version
router.post(
  '/admin/forms/:formId/versions/:versionId/publish',
  function (req, res) {
    return __awaiter(void 0, void 0, void 0, function () {
      var versionId, _a, userId, changelog, published, error_7;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 2, , 3]);
            versionId = parseInt(req.params.versionId);
            ((_a = req.body), (userId = _a.userId), (changelog = _a.changelog));
            if (!changelog) {
              return [
                2 /*return*/,
                res.status(400).json({ error: 'Changelog is required' }),
              ];
            }
            return [
              4 /*yield*/,
              storage.publishFormVersion(
                versionId,
                userId || 'user',
                changelog
              ),
            ];
          case 1:
            published = _b.sent();
            res.json(published);
            return [3 /*break*/, 3];
          case 2:
            error_7 = _b.sent();
            console.error('Error publishing form version:', error_7);
            if (error_7.message.includes('Can only publish')) {
              return [
                2 /*return*/,
                res.status(400).json({ error: error_7.message }),
              ];
            }
            res.status(500).json({ error: 'Internal server error' });
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  }
);
// Discard draft
router.post(
  '/admin/forms/:formId/versions/:versionId/discard',
  function (req, res) {
    return __awaiter(void 0, void 0, void 0, function () {
      var versionId, error_8;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            versionId = parseInt(req.params.versionId);
            return [4 /*yield*/, storage.discardFormVersion(versionId)];
          case 1:
            _a.sent();
            res.json({ success: true });
            return [3 /*break*/, 3];
          case 2:
            error_8 = _a.sent();
            console.error('Error discarding form version:', error_8);
            if (error_8.message.includes('Can only discard')) {
              return [
                2 /*return*/,
                res.status(400).json({ error: error_8.message }),
              ];
            }
            res.status(500).json({ error: 'Internal server error' });
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  }
);
// Rollback to previous version (create new draft from old version)
router.post(
  '/admin/forms/:formId/versions/:versionId/rollback',
  function (req, res) {
    return __awaiter(void 0, void 0, void 0, function () {
      var formId,
        versionId,
        sourceVersion,
        existingVersions,
        existingDraft,
        latestVersion,
        newVersionNo,
        newDraft,
        error_9;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 4, , 5]);
            formId = parseInt(req.params.formId);
            versionId = parseInt(req.params.versionId);
            return [4 /*yield*/, storage.getFormVersion(versionId)];
          case 1:
            sourceVersion = _a.sent();
            if (!sourceVersion) {
              return [
                2 /*return*/,
                res.status(404).json({ error: 'Version not found' }),
              ];
            }
            return [4 /*yield*/, storage.getFormVersions(formId)];
          case 2:
            existingVersions = _a.sent();
            existingDraft = existingVersions.find(function (v) {
              return v.status === 'DRAFT';
            });
            if (existingDraft) {
              return [
                2 /*return*/,
                res.status(400).json({ error: 'Draft version already exists' }),
              ];
            }
            latestVersion = existingVersions[0];
            newVersionNo = latestVersion ? latestVersion.versionNo + 1 : 1;
            return [
              4 /*yield*/,
              storage.createFormVersion({
                formId: formId,
                versionNo: newVersionNo,
                versionDate: new Date(),
                status: 'DRAFT',
                authorUserId: req.body.userId || 'user',
                changelog: 'Rollback from version '.concat(
                  sourceVersion.versionNo
                ),
                schemaJson: sourceVersion.schemaJson,
              }),
            ];
          case 3:
            newDraft = _a.sent();
            res.json(newDraft);
            return [3 /*break*/, 5];
          case 4:
            error_9 = _a.sent();
            console.error('Error rolling back form version:', error_9);
            res.status(500).json({ error: 'Internal server error' });
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  }
);
// Runtime endpoint - get latest published schema for operational use
router.get('/forms/runtime/:name', function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var name_1, version, error_10;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3, , 4]);
          name_1 = req.params.name;
          return [4 /*yield*/, storage.getLatestPublishedVersionByName(name_1)];
        case 1:
          version = _a.sent();
          if (!version) {
            return [
              2 /*return*/,
              res.status(404).json({ error: 'No published version found' }),
            ];
          }
          // Track usage
          return [
            4 /*yield*/,
            storage.createFormVersionUsage({
              formVersionId: version.id,
              usedInModule: req.headers['x-module'] || 'unknown',
              usedAt: new Date(),
            }),
          ];
        case 2:
          // Track usage
          _a.sent();
          res.json({
            versionId: version.id,
            versionNo: version.versionNo,
            schema: JSON.parse(version.schemaJson),
          });
          return [3 /*break*/, 4];
        case 3:
          error_10 = _a.sent();
          console.error('Error fetching runtime form:', error_10);
          res.status(500).json({ error: 'Internal server error' });
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
});
export default router;
//# sourceMappingURL=forms.js.map
