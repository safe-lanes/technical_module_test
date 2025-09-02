import { __assign, __awaiter, __generator } from "tslib";
import { Router } from "express";
import { storage } from "../storage";
var router = Router();
// Get all alert policies
router.get("/policies", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var policies, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, storage.getAlertPolicies()];
            case 1:
                policies = _a.sent();
                res.json(policies);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching alert policies:", error_1);
                res.status(500).json({ error: "Failed to fetch alert policies" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get single alert policy
router.get("/policies/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, policy, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = parseInt(req.params.id);
                return [4 /*yield*/, storage.getAlertPolicy(id)];
            case 1:
                policy = _a.sent();
                if (!policy) {
                    return [2 /*return*/, res.status(404).json({ error: "Alert policy not found" })];
                }
                res.json(policy);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching alert policy:", error_2);
                res.status(500).json({ error: "Failed to fetch alert policy" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update alert policy
router.patch("/policies/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, policy, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = parseInt(req.params.id);
                return [4 /*yield*/, storage.updateAlertPolicy(id, req.body)];
            case 1:
                policy = _a.sent();
                res.json(policy);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error("Error updating alert policy:", error_3);
                res.status(500).json({ error: "Failed to update alert policy" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Batch update alert policies
router.post("/policies/batch-update", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updates, results, _i, updates_1, update, policy, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                updates = req.body.policies;
                results = [];
                _i = 0, updates_1 = updates;
                _a.label = 1;
            case 1:
                if (!(_i < updates_1.length)) return [3 /*break*/, 4];
                update = updates_1[_i];
                return [4 /*yield*/, storage.updateAlertPolicy(update.id, update)];
            case 2:
                policy = _a.sent();
                results.push(policy);
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                res.json({ success: true, policies: results });
                return [3 /*break*/, 6];
            case 5:
                error_4 = _a.sent();
                console.error("Error batch updating alert policies:", error_4);
                res.status(500).json({ error: "Failed to batch update alert policies" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Get alert events (history)
router.get("/events", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var filters, events, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                filters = {
                    startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                    endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
                    alertType: req.query.alertType,
                    priority: req.query.priority,
                    status: req.query.status,
                    vesselId: req.query.vesselId,
                };
                return [4 /*yield*/, storage.getAlertEvents(filters)];
            case 1:
                events = _a.sent();
                res.json(events);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error("Error fetching alert events:", error_5);
                res.status(500).json({ error: "Failed to fetch alert events" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get alert event details
router.get("/events/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, event_1, deliveries, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = parseInt(req.params.id);
                return [4 /*yield*/, storage.getAlertEvent(id)];
            case 1:
                event_1 = _a.sent();
                if (!event_1) {
                    return [2 /*return*/, res.status(404).json({ error: "Alert event not found" })];
                }
                return [4 /*yield*/, storage.getAlertDeliveries(id)];
            case 2:
                deliveries = _a.sent();
                res.json(__assign(__assign({}, event_1), { deliveries: deliveries }));
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                console.error("Error fetching alert event:", error_6);
                res.status(500).json({ error: "Failed to fetch alert event" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Acknowledge alert event
router.post("/events/:id/acknowledge", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, event_2, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = parseInt(req.params.id);
                userId = req.body.userId || "user1";
                return [4 /*yield*/, storage.acknowledgeAlertEvent(id, userId)];
            case 1:
                event_2 = _a.sent();
                res.json(event_2);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error("Error acknowledging alert event:", error_7);
                res.status(500).json({ error: "Failed to acknowledge alert event" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Send test alert
router.post("/test", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, policyId, userId, policy, event_3, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, policyId = _a.policyId, userId = _a.userId;
                return [4 /*yield*/, storage.getAlertPolicy(policyId)];
            case 1:
                policy = _b.sent();
                if (!policy) {
                    return [2 /*return*/, res.status(404).json({ error: "Alert policy not found" })];
                }
                return [4 /*yield*/, storage.createAlertEvent({
                        policyId: policyId,
                        alertType: policy.alertType,
                        priority: policy.priority,
                        objectType: 'test',
                        objectId: 'test-' + Date.now(),
                        vesselId: 'V001',
                        dedupeKey: "test-".concat(policyId, "-").concat(Date.now()),
                        state: 'test',
                        payload: JSON.stringify({
                            test: true,
                            message: "This is a test alert for ".concat(policy.alertType),
                            timestamp: new Date().toISOString()
                        })
                    })];
            case 2:
                event_3 = _b.sent();
                if (!policy.inAppEnabled) return [3 /*break*/, 4];
                return [4 /*yield*/, storage.createAlertDelivery({
                        eventId: event_3.id,
                        channel: 'in_app',
                        recipient: userId || 'user1',
                        status: 'sent'
                    })];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                if (!policy.emailEnabled) return [3 /*break*/, 6];
                return [4 /*yield*/, storage.createAlertDelivery({
                        eventId: event_3.id,
                        channel: 'email',
                        recipient: userId || 'user1@example.com',
                        status: 'sent'
                    })];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                res.json({ success: true, event: event_3 });
                return [3 /*break*/, 8];
            case 7:
                error_8 = _b.sent();
                console.error("Error sending test alert:", error_8);
                res.status(500).json({ error: "Failed to send test alert" });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
// Get alert configuration
router.get("/config/:vesselId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var config, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, storage.getAlertConfig(req.params.vesselId)];
            case 1:
                config = _a.sent();
                res.json(config || {
                    vesselId: req.params.vesselId,
                    quietHoursEnabled: false,
                    quietHoursStart: null,
                    quietHoursEnd: null,
                    escalationEnabled: false,
                    escalationHours: 4,
                    escalationRecipients: '[]'
                });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error("Error fetching alert config:", error_9);
                res.status(500).json({ error: "Failed to fetch alert config" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update alert configuration
router.post("/config", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var config, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, storage.createOrUpdateAlertConfig(__assign(__assign({}, req.body), { updatedBy: req.body.userId || 'user1' }))];
            case 1:
                config = _a.sent();
                res.json(config);
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                console.error("Error updating alert config:", error_10);
                res.status(500).json({ error: "Failed to update alert config" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
export default router;
//# sourceMappingURL=alerts.js.map