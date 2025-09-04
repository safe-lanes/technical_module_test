import { __assign, __awaiter, __generator } from 'tslib';
import { Router } from 'express';
import { z } from 'zod';
import {
  insertChangeRequestSchema,
  insertChangeRequestCommentSchema,
  insertChangeRequestAttachmentSchema,
} from '@shared/schema';
export default function createChangeRequestsRouter(storage) {
  var _this = this;
  var router = Router();
  // Get all change requests with filtering
  router.get('/', function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var _a, vesselId, status_1, category_1, requestedBy_1, requests, error_1;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 2, , 3]);
            ((_a = req.query),
              (vesselId = _a.vesselId),
              (status_1 = _a.status),
              (category_1 = _a.category),
              (requestedBy_1 = _a.requestedBy));
            return [
              4 /*yield*/,
              storage.getChangeRequests({ vesselId: vesselId }),
            ];
          case 1:
            requests = _b.sent();
            // Apply filters
            if (status_1) {
              requests = requests.filter(function (r) {
                return r.status === status_1;
              });
            }
            if (category_1) {
              requests = requests.filter(function (r) {
                return r.category === category_1;
              });
            }
            if (requestedBy_1) {
              requests = requests.filter(function (r) {
                return r.requestedByUserId === requestedBy_1;
              });
            }
            // Sort by most recent first
            requests.sort(function (a, b) {
              return b.createdAt.getTime() - a.createdAt.getTime();
            });
            res.json(requests);
            return [3 /*break*/, 3];
          case 2:
            error_1 = _b.sent();
            console.error('Error fetching change requests:', error_1);
            res.status(500).json({ error: 'Failed to fetch change requests' });
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  });
  // Get a specific change request by ID
  router.get('/:id', function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var id, request, error_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            id = parseInt(req.params.id);
            return [4 /*yield*/, storage.getChangeRequest(id)];
          case 1:
            request = _a.sent();
            if (!request) {
              return [
                2 /*return*/,
                res.status(404).json({ error: 'Change request not found' }),
              ];
            }
            res.json(request);
            return [3 /*break*/, 3];
          case 2:
            error_2 = _a.sent();
            console.error('Error fetching change request:', error_2);
            res.status(500).json({ error: 'Failed to fetch change request' });
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  });
  // Create a new change request
  router.post('/', function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var validatedData, requestData, newRequest, error_3;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            validatedData = insertChangeRequestSchema.parse(req.body);
            requestData = __assign(__assign({}, validatedData), {
              vesselId: validatedData.vesselId || 'V001',
              status: validatedData.status || 'draft',
              requestedByUserId: validatedData.requestedByUserId || 'system',
            });
            return [4 /*yield*/, storage.createChangeRequest(requestData)];
          case 1:
            newRequest = _a.sent();
            res.status(201).json(newRequest);
            return [3 /*break*/, 3];
          case 2:
            error_3 = _a.sent();
            if (error_3 instanceof z.ZodError) {
              return [
                2 /*return*/,
                res
                  .status(400)
                  .json({
                    error: 'Validation failed',
                    details: error_3.errors,
                  }),
              ];
            }
            console.error('Error creating change request:', error_3);
            res.status(500).json({ error: 'Failed to create change request' });
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  });
  // Update change request status
  router.patch('/:id/status', function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var id,
        _a,
        status_2,
        reviewedByUserId,
        reviewComments,
        updatedRequest,
        error_4;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 2, , 3]);
            id = parseInt(req.params.id);
            ((_a = req.body),
              (status_2 = _a.status),
              (reviewedByUserId = _a.reviewedByUserId),
              (reviewComments = _a.reviewComments));
            if (
              ![
                'draft',
                'submitted',
                'returned',
                'approved',
                'rejected',
              ].includes(status_2)
            ) {
              return [
                2 /*return*/,
                res.status(400).json({ error: 'Invalid status' }),
              ];
            }
            return [
              4 /*yield*/,
              storage.updateChangeRequest(id, {
                status: status_2,
                reviewedByUserId: reviewedByUserId,
                reviewedAt: new Date(),
              }),
            ];
          case 1:
            updatedRequest = _b.sent();
            res.json(updatedRequest);
            return [3 /*break*/, 3];
          case 2:
            error_4 = _b.sent();
            console.error('Error updating change request status:', error_4);
            res
              .status(500)
              .json({ error: 'Failed to update change request status' });
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  });
  // Get comments for a change request
  router.get('/:id/comments', function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var changeRequestId, comments, error_5;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            changeRequestId = parseInt(req.params.id);
            return [
              4 /*yield*/,
              storage.getChangeRequestComments(changeRequestId),
            ];
          case 1:
            comments = _a.sent();
            res.json(comments);
            return [3 /*break*/, 3];
          case 2:
            error_5 = _a.sent();
            console.error('Error fetching comments:', error_5);
            res.status(500).json({ error: 'Failed to fetch comments' });
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  });
  // Add comment to change request
  router.post('/:id/comments', function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var changeRequestId, commentData, validatedData, newComment, error_6;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            changeRequestId = parseInt(req.params.id);
            commentData = __assign(__assign({}, req.body), {
              changeRequestId: changeRequestId,
            });
            validatedData = insertChangeRequestCommentSchema.parse(commentData);
            return [
              4 /*yield*/,
              storage.createChangeRequestComment(validatedData),
            ];
          case 1:
            newComment = _a.sent();
            res.status(201).json(newComment);
            return [3 /*break*/, 3];
          case 2:
            error_6 = _a.sent();
            if (error_6 instanceof z.ZodError) {
              return [
                2 /*return*/,
                res
                  .status(400)
                  .json({
                    error: 'Validation failed',
                    details: error_6.errors,
                  }),
              ];
            }
            console.error('Error creating comment:', error_6);
            res.status(500).json({ error: 'Failed to create comment' });
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  });
  // Get attachments for a change request
  router.get('/:id/attachments', function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var changeRequestId, attachments, error_7;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            changeRequestId = parseInt(req.params.id);
            return [
              4 /*yield*/,
              storage.getChangeRequestAttachments(changeRequestId),
            ];
          case 1:
            attachments = _a.sent();
            res.json(attachments);
            return [3 /*break*/, 3];
          case 2:
            error_7 = _a.sent();
            console.error('Error fetching attachments:', error_7);
            res.status(500).json({ error: 'Failed to fetch attachments' });
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  });
  // Add attachment to change request
  router.post('/:id/attachments', function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var changeRequestId,
        attachmentData,
        validatedData,
        newAttachment,
        error_8;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            changeRequestId = parseInt(req.params.id);
            attachmentData = __assign(__assign({}, req.body), {
              changeRequestId: changeRequestId,
            });
            validatedData =
              insertChangeRequestAttachmentSchema.parse(attachmentData);
            return [
              4 /*yield*/,
              storage.createChangeRequestAttachment(validatedData),
            ];
          case 1:
            newAttachment = _a.sent();
            res.status(201).json(newAttachment);
            return [3 /*break*/, 3];
          case 2:
            error_8 = _a.sent();
            if (error_8 instanceof z.ZodError) {
              return [
                2 /*return*/,
                res
                  .status(400)
                  .json({
                    error: 'Validation failed',
                    details: error_8.errors,
                  }),
              ];
            }
            console.error('Error creating attachment:', error_8);
            res.status(500).json({ error: 'Failed to create attachment' });
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  });
  // Approve a change request
  router.put('/:id/approve', function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var id, _a, comment, reviewerId, updated, error_9;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 2, , 3]);
            id = parseInt(req.params.id);
            ((_a = req.body),
              (comment = _a.comment),
              (reviewerId = _a.reviewerId));
            if (!comment) {
              return [
                2 /*return*/,
                res
                  .status(400)
                  .json({ error: 'Comment is required for approval' }),
              ];
            }
            return [
              4 /*yield*/,
              storage.approveChangeRequest(
                id,
                reviewerId || 'reviewer',
                comment
              ),
            ];
          case 1:
            updated = _b.sent();
            res.json(updated);
            return [3 /*break*/, 3];
          case 2:
            error_9 = _b.sent();
            console.error('Error approving change request:', error_9);
            res
              .status(500)
              .json({
                error: error_9.message || 'Failed to approve change request',
              });
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  });
  // Reject a change request
  router.put('/:id/reject', function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var id, _a, comment, reviewerId, updated, error_10;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 2, , 3]);
            id = parseInt(req.params.id);
            ((_a = req.body),
              (comment = _a.comment),
              (reviewerId = _a.reviewerId));
            console.log(
              'Rejecting change request:',
              id,
              'with comment:',
              comment
            );
            if (!comment) {
              return [
                2 /*return*/,
                res
                  .status(400)
                  .json({ error: 'Comment is required for rejection' }),
              ];
            }
            return [
              4 /*yield*/,
              storage.rejectChangeRequest(
                id,
                reviewerId || 'reviewer',
                comment
              ),
            ];
          case 1:
            updated = _b.sent();
            console.log('Successfully rejected request:', updated);
            res.json(updated);
            return [3 /*break*/, 3];
          case 2:
            error_10 = _b.sent();
            console.error('Error rejecting change request:', error_10);
            res
              .status(500)
              .json({
                error: error_10.message || 'Failed to reject change request',
              });
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  });
  return router;
}
//# sourceMappingURL=changeRequests.js.map
