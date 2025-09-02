import { __assign, __awaiter, __generator, __spreadArray } from "tslib";
import { createServer } from "http";
import { storage } from "./storage";
import bulkRoutes from "./routes/bulk";
import alertRoutes from "./routes/alerts";
import formRoutes from "./routes/forms";
import createChangeRequestsRouter from "./routes/changeRequests";
import { requestLogger } from "./middleware/logger";
import { globalErrorHandler, notFoundHandler, asyncHandler } from "./middleware/errorHandler";
import { requireAuth, requirePermission, authenticateUser } from "./middleware/auth";
import { Permission } from "../shared/types/auth";
export function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var httpServer;
        var _this = this;
        return __generator(this, function (_a) {
            // Add request logging middleware
            app.use(requestLogger);
            // Authentication routes (public)
            app.post("/api/auth/login", asyncHandler(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, username, password, result;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = req.body, username = _a.username, password = _a.password;
                            if (!username || !password) {
                                return [2 /*return*/, res.status(400).json({ error: "Username and password are required" })];
                            }
                            return [4 /*yield*/, authenticateUser(username, password)];
                        case 1:
                            result = _b.sent();
                            res.json(result);
                            return [2 /*return*/];
                    }
                });
            }); }));
            app.post("/api/auth/logout", function (req, res) {
                // In production, you would invalidate the token
                res.json({ success: true, message: "Logged out successfully" });
            });
            // Health check endpoint
            app.get("/api/health", asyncHandler(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    res.json({
                        status: "healthy",
                        timestamp: new Date().toISOString(),
                        environment: process.env.NODE_ENV
                    });
                    return [2 /*return*/];
                });
            }); }));
            // Components API routes (for Target Picker) - requires authentication
            app.get("/api/components/:vesselId", requireAuth, requirePermission(Permission.COMPONENTS_READ), asyncHandler(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var components;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, storage.getComponents(req.params.vesselId)];
                        case 1:
                            components = _a.sent();
                            res.json(components);
                            return [2 /*return*/];
                    }
                });
            }); }));
            // Work Orders API routes (for Target Picker - placeholder)
            app.get("/api/work-orders", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        // Return empty array for now - will be implemented when Work Orders module is built
                        res.json([]);
                    }
                    catch (error) {
                        res.status(500).json({ error: "Failed to fetch work orders" });
                    }
                    return [2 /*return*/];
                });
            }); });
            // Running Hours API routes
            // Get components for a vessel
            app.get("/api/running-hours/components/:vesselId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var components, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getComponents(req.params.vesselId)];
                        case 1:
                            components = _a.sent();
                            res.json(components);
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            res.status(500).json({ error: "Failed to fetch components" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Update component running hours
            app.post("/api/running-hours/update/:componentId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var componentId, updateData, audit, component, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            componentId = req.params.componentId;
                            updateData = req.body;
                            return [4 /*yield*/, storage.createRunningHoursAudit(updateData.audit)];
                        case 1:
                            audit = _a.sent();
                            return [4 /*yield*/, storage.updateComponent(componentId, {
                                    currentCumulativeRH: updateData.cumulativeRH.toString(),
                                    lastUpdated: updateData.dateUpdatedLocal
                                })];
                        case 2:
                            component = _a.sent();
                            res.json({ component: component, audit: audit });
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            res.status(500).json({ error: "Failed to update running hours" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Bulk update running hours
            app.post("/api/running-hours/bulk-update", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var updates, results, _i, updates_1, update, audit, component, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            updates = req.body.updates;
                            results = [];
                            _i = 0, updates_1 = updates;
                            _a.label = 1;
                        case 1:
                            if (!(_i < updates_1.length)) return [3 /*break*/, 5];
                            update = updates_1[_i];
                            return [4 /*yield*/, storage.createRunningHoursAudit(update.audit)];
                        case 2:
                            audit = _a.sent();
                            return [4 /*yield*/, storage.updateComponent(update.componentId, {
                                    currentCumulativeRH: update.cumulativeRH.toString(),
                                    lastUpdated: update.dateUpdatedLocal
                                })];
                        case 3:
                            component = _a.sent();
                            results.push({ component: component, audit: audit });
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 1];
                        case 5:
                            res.json({ results: results });
                            return [3 /*break*/, 7];
                        case 6:
                            error_3 = _a.sent();
                            res.status(500).json({ error: "Failed to perform bulk update" });
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); });
            // Get running hours audits for a component
            app.get("/api/running-hours/audits/:componentId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var componentId, limit, audits, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            componentId = req.params.componentId;
                            limit = req.query.limit ? parseInt(req.query.limit) : undefined;
                            return [4 /*yield*/, storage.getRunningHoursAudits(componentId, limit)];
                        case 1:
                            audits = _a.sent();
                            res.json(audits);
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            res.status(500).json({ error: "Failed to fetch audits" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Get utilization rate for components
            app.post("/api/running-hours/utilization-rates", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var componentIds, rates, today, thirtyDaysAgo_1, _i, componentIds_1, componentId, audits, allAudits, anchorAudit, windowAudits, start, end, deltaHours, startDate, endDate, deltaDays, utilization, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            componentIds = req.body.componentIds;
                            rates = {};
                            today = new Date();
                            thirtyDaysAgo_1 = new Date(today);
                            thirtyDaysAgo_1.setDate(today.getDate() - 30);
                            _i = 0, componentIds_1 = componentIds;
                            _a.label = 1;
                        case 1:
                            if (!(_i < componentIds_1.length)) return [3 /*break*/, 5];
                            componentId = componentIds_1[_i];
                            return [4 /*yield*/, storage.getRunningHoursAuditsInDateRange(componentId, thirtyDaysAgo_1, today)];
                        case 2:
                            audits = _a.sent();
                            return [4 /*yield*/, storage.getRunningHoursAudits(componentId)];
                        case 3:
                            allAudits = _a.sent();
                            anchorAudit = allAudits.find(function (a) { return new Date(a.dateUpdatedLocal) < thirtyDaysAgo_1; });
                            windowAudits = anchorAudit ? __spreadArray([anchorAudit], audits, true) : audits;
                            if (windowAudits.length < 2) {
                                rates[componentId] = null;
                            }
                            else {
                                start = windowAudits[0];
                                end = windowAudits[windowAudits.length - 1];
                                deltaHours = parseFloat(end.cumulativeRH) - parseFloat(start.cumulativeRH);
                                startDate = new Date(start.dateUpdatedLocal);
                                endDate = new Date(end.dateUpdatedLocal);
                                deltaDays = Math.max((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24), 1);
                                utilization = Math.max(deltaHours / deltaDays, 0);
                                rates[componentId] = Math.round(utilization * 10) / 10;
                            }
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 1];
                        case 5:
                            res.json(rates);
                            return [3 /*break*/, 7];
                        case 6:
                            error_5 = _a.sent();
                            res.status(500).json({ error: "Failed to calculate utilization rates" });
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); });
            // Spares API routes
            // Get all spares for a vessel
            app.get("/api/spares/:vesselId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var spares, sparesWithStatus, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getSpares(req.params.vesselId)];
                        case 1:
                            spares = _a.sent();
                            sparesWithStatus = spares.map(function (spare) { return (__assign(__assign({}, spare), { stockStatus: spare.rob < spare.min ? 'Low' : spare.rob === spare.min ? 'Minimum' : 'OK' })); });
                            res.json(sparesWithStatus);
                            return [3 /*break*/, 3];
                        case 2:
                            error_6 = _a.sent();
                            res.status(500).json({ error: "Failed to fetch spares" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Get single spare
            app.get("/api/spares/item/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var spare, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getSpare(parseInt(req.params.id))];
                        case 1:
                            spare = _a.sent();
                            if (!spare) {
                                return [2 /*return*/, res.status(404).json({ error: "Spare not found" })];
                            }
                            res.json(spare);
                            return [3 /*break*/, 3];
                        case 2:
                            error_7 = _a.sent();
                            res.status(500).json({ error: "Failed to fetch spare" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Create new spare
            app.post("/api/spares", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var spare, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.createSpare(req.body)];
                        case 1:
                            spare = _a.sent();
                            res.json(spare);
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _a.sent();
                            res.status(500).json({ error: "Failed to create spare" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Update spare
            app.put("/api/spares/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var spare, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.updateSpare(parseInt(req.params.id), req.body)];
                        case 1:
                            spare = _a.sent();
                            res.json(spare);
                            return [3 /*break*/, 3];
                        case 2:
                            error_9 = _a.sent();
                            res.status(500).json({ error: "Failed to update spare" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Delete spare
            app.delete("/api/spares/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.deleteSpare(parseInt(req.params.id))];
                        case 1:
                            _a.sent();
                            res.json({ success: true });
                            return [3 /*break*/, 3];
                        case 2:
                            error_10 = _a.sent();
                            res.status(500).json({ error: "Failed to delete spare" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Consume spare
            app.post("/api/spares/:id/consume", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, vesselId, qty, dateLocal, tz, place, remarks, userId, today, inputDate, spare, spareWithStatus, error_11;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            _a = req.body, vesselId = _a.vesselId, qty = _a.qty, dateLocal = _a.dateLocal, tz = _a.tz, place = _a.place, remarks = _a.remarks, userId = _a.userId;
                            // Validation
                            if (!qty || qty < 1) {
                                return [2 /*return*/, res.status(400).json({ error: "Quantity must be at least 1" })];
                            }
                            today = new Date();
                            inputDate = new Date(dateLocal);
                            if (inputDate > today) {
                                return [2 /*return*/, res.status(400).json({ error: "Date cannot be in the future" })];
                            }
                            return [4 /*yield*/, storage.consumeSpare(parseInt(req.params.id), qty, userId || 'user', remarks, place, dateLocal, tz || 'UTC')];
                        case 1:
                            spare = _b.sent();
                            spareWithStatus = __assign(__assign({}, spare), { stockStatus: spare.rob < spare.min ? 'Low' : spare.rob === spare.min ? 'Minimum' : 'OK' });
                            res.json(spareWithStatus);
                            return [3 /*break*/, 3];
                        case 2:
                            error_11 = _b.sent();
                            if (error_11.message === 'Insufficient stock') {
                                res.status(400).json({ error: error_11.message });
                            }
                            else {
                                res.status(500).json({ error: "Failed to consume spare" });
                            }
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Receive spare
            app.post("/api/spares/:id/receive", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, vesselId, qty, dateLocal, tz, place, supplierPO, remarks, userId, today, inputDate, spare, spareWithStatus, error_12;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            _a = req.body, vesselId = _a.vesselId, qty = _a.qty, dateLocal = _a.dateLocal, tz = _a.tz, place = _a.place, supplierPO = _a.supplierPO, remarks = _a.remarks, userId = _a.userId;
                            // Validation
                            if (!qty || qty < 1) {
                                return [2 /*return*/, res.status(400).json({ error: "Quantity must be at least 1" })];
                            }
                            today = new Date();
                            inputDate = new Date(dateLocal);
                            if (inputDate > today) {
                                return [2 /*return*/, res.status(400).json({ error: "Date cannot be in the future" })];
                            }
                            return [4 /*yield*/, storage.receiveSpare(parseInt(req.params.id), qty, userId || 'user', remarks, supplierPO, place, dateLocal, tz || 'UTC')];
                        case 1:
                            spare = _b.sent();
                            spareWithStatus = __assign(__assign({}, spare), { stockStatus: spare.rob < spare.min ? 'Low' : spare.rob === spare.min ? 'Minimum' : 'OK' });
                            res.json(spareWithStatus);
                            return [3 /*break*/, 3];
                        case 2:
                            error_12 = _b.sent();
                            res.status(500).json({ error: "Failed to receive spare" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Bulk update spares
            app.post("/api/spares/bulk-update", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, vesselId, tz, rows, results, _i, rows_1, row, spare, updatedSpare, error_13, error_14;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 12, , 13]);
                            _a = req.body, vesselId = _a.vesselId, tz = _a.tz, rows = _a.rows;
                            results = [];
                            _i = 0, rows_1 = rows;
                            _b.label = 1;
                        case 1:
                            if (!(_i < rows_1.length)) return [3 /*break*/, 11];
                            row = rows_1[_i];
                            // Skip rows where both consumed and received are 0
                            if (row.consumed === 0 && row.received === 0) {
                                results.push({
                                    componentSpareId: row.componentSpareId,
                                    success: false,
                                    message: null // Skipped
                                });
                                return [3 /*break*/, 10];
                            }
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 9, , 10]);
                            return [4 /*yield*/, storage.getSpare(row.componentSpareId)];
                        case 3:
                            spare = _b.sent();
                            if (!spare) {
                                results.push({
                                    componentSpareId: row.componentSpareId,
                                    success: false,
                                    message: "Spare not found"
                                });
                                return [3 /*break*/, 10];
                            }
                            // Validate insufficient stock
                            if (row.consumed > 0 && spare.rob < row.consumed) {
                                results.push({
                                    componentSpareId: row.componentSpareId,
                                    success: false,
                                    message: "Insufficient stock"
                                });
                                return [3 /*break*/, 10];
                            }
                            if (!(row.consumed > 0)) return [3 /*break*/, 5];
                            return [4 /*yield*/, storage.consumeSpare(row.componentSpareId, row.consumed, row.userId || 'user', row.remarks, undefined, row.dateLocal || new Date().toISOString().split('T')[0], tz || 'UTC')];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5:
                            if (!(row.received > 0)) return [3 /*break*/, 7];
                            return [4 /*yield*/, storage.receiveSpare(row.componentSpareId, row.received, row.userId || 'user', row.remarks, undefined, row.receivedPlace, row.receivedDate, tz || 'UTC')];
                        case 6:
                            _b.sent();
                            _b.label = 7;
                        case 7: return [4 /*yield*/, storage.getSpare(row.componentSpareId)];
                        case 8:
                            updatedSpare = _b.sent();
                            results.push({
                                componentSpareId: row.componentSpareId,
                                success: true,
                                robAfter: (updatedSpare === null || updatedSpare === void 0 ? void 0 : updatedSpare.rob) || 0
                            });
                            return [3 /*break*/, 10];
                        case 9:
                            error_13 = _b.sent();
                            results.push({
                                componentSpareId: row.componentSpareId,
                                success: false,
                                message: error_13.message || "Failed to update"
                            });
                            return [3 /*break*/, 10];
                        case 10:
                            _i++;
                            return [3 /*break*/, 1];
                        case 11:
                            res.json(results);
                            return [3 /*break*/, 13];
                        case 12:
                            error_14 = _b.sent();
                            res.status(500).json({ error: "Failed to perform bulk update" });
                            return [3 /*break*/, 13];
                        case 13: return [2 /*return*/];
                    }
                });
            }); });
            // Get spares history
            app.get("/api/spares/history/:vesselId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var history_1, error_15;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getSpareHistory(req.params.vesselId)];
                        case 1:
                            history_1 = _a.sent();
                            res.json(history_1);
                            return [3 /*break*/, 3];
                        case 2:
                            error_15 = _a.sent();
                            res.status(500).json({ error: "Failed to fetch history" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Get history for specific spare
            app.get("/api/spares/history/spare/:spareId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var history_2, error_16;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getSpareHistoryBySpareId(parseInt(req.params.spareId))];
                        case 1:
                            history_2 = _a.sent();
                            res.json(history_2);
                            return [3 /*break*/, 3];
                        case 2:
                            error_16 = _a.sent();
                            res.status(500).json({ error: "Failed to fetch spare history" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Change Request API routes
            // Get change requests with filters
            app.get("/api/modify-pms/requests", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var filters, requests, error_17;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            filters = {
                                category: req.query.category,
                                status: req.query.status,
                                q: req.query.q,
                                vesselId: req.query.vesselId
                            };
                            return [4 /*yield*/, storage.getChangeRequests(filters)];
                        case 1:
                            requests = _a.sent();
                            res.json(requests);
                            return [3 /*break*/, 3];
                        case 2:
                            error_17 = _a.sent();
                            res.status(500).json({ error: "Failed to fetch change requests" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Get single change request
            app.get("/api/modify-pms/requests/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var request, attachments, comments, error_18;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, storage.getChangeRequest(parseInt(req.params.id))];
                        case 1:
                            request = _a.sent();
                            if (!request) {
                                return [2 /*return*/, res.status(404).json({ error: "Change request not found" })];
                            }
                            return [4 /*yield*/, storage.getChangeRequestAttachments(request.id)];
                        case 2:
                            attachments = _a.sent();
                            return [4 /*yield*/, storage.getChangeRequestComments(request.id)];
                        case 3:
                            comments = _a.sent();
                            res.json(__assign(__assign({}, request), { attachments: attachments, comments: comments }));
                            return [3 /*break*/, 5];
                        case 4:
                            error_18 = _a.sent();
                            res.status(500).json({ error: "Failed to fetch change request" });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            // Create change request (draft)
            app.post("/api/modify-pms/requests", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, vesselId, category, title, reason, request, error_19;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            _a = req.body, vesselId = _a.vesselId, category = _a.category, title = _a.title, reason = _a.reason;
                            // Validation for draft - only title required
                            if (!title) {
                                return [2 /*return*/, res.status(400).json({ error: "Title is required" })];
                            }
                            return [4 /*yield*/, storage.createChangeRequest({
                                    vesselId: vesselId || '',
                                    category: category || 'components',
                                    title: title.substring(0, 120), // Enforce max length
                                    reason: reason || '',
                                    status: 'draft',
                                    requestedByUserId: req.body.userId || 'current_user'
                                })];
                        case 1:
                            request = _b.sent();
                            res.json(request);
                            return [3 /*break*/, 3];
                        case 2:
                            error_19 = _b.sent();
                            res.status(500).json({ error: "Failed to create change request" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Update change request (draft/returned only)
            app.put("/api/modify-pms/requests/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, existing, _a, vesselId, category, title, reason, updated, error_20;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            id = parseInt(req.params.id);
                            return [4 /*yield*/, storage.getChangeRequest(id)];
                        case 1:
                            existing = _b.sent();
                            if (!existing) {
                                return [2 /*return*/, res.status(404).json({ error: "Change request not found" })];
                            }
                            if (existing.status !== 'draft' && existing.status !== 'returned') {
                                return [2 /*return*/, res.status(400).json({ error: "Can only edit draft or returned requests" })];
                            }
                            _a = req.body, vesselId = _a.vesselId, category = _a.category, title = _a.title, reason = _a.reason;
                            return [4 /*yield*/, storage.updateChangeRequest(id, {
                                    vesselId: vesselId,
                                    category: category,
                                    title: title === null || title === void 0 ? void 0 : title.substring(0, 120),
                                    reason: reason
                                })];
                        case 2:
                            updated = _b.sent();
                            res.json(updated);
                            return [3 /*break*/, 4];
                        case 3:
                            error_20 = _b.sent();
                            res.status(500).json({ error: "Failed to update change request" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Update change request target (draft/returned only)
            app.put("/api/modify-pms/requests/:id/target", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, _a, targetType, targetId, snapshotBeforeJson, updated, error_21;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            _a = req.body, targetType = _a.targetType, targetId = _a.targetId, snapshotBeforeJson = _a.snapshotBeforeJson;
                            return [4 /*yield*/, storage.updateChangeRequestTarget(id, targetType, targetId, snapshotBeforeJson)];
                        case 1:
                            updated = _b.sent();
                            res.json(updated);
                            return [3 /*break*/, 3];
                        case 2:
                            error_21 = _b.sent();
                            res.status(500).json({ error: error_21.message || "Failed to update target" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Update proposed changes (draft/returned only)
            app.put("/api/modify-pms/requests/:id/proposed", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, _a, proposedChangesJson, movePreviewJson, updated, error_22;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            _a = req.body, proposedChangesJson = _a.proposedChangesJson, movePreviewJson = _a.movePreviewJson;
                            return [4 /*yield*/, storage.updateChangeRequestProposed(id, proposedChangesJson, movePreviewJson)];
                        case 1:
                            updated = _b.sent();
                            res.json(updated);
                            return [3 /*break*/, 3];
                        case 2:
                            error_22 = _b.sent();
                            res.status(500).json({ error: error_22.message || "Failed to update proposed changes" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Submit change request
            app.put("/api/modify-pms/requests/:id/submit", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, existing, updated, error_23;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            id = parseInt(req.params.id);
                            return [4 /*yield*/, storage.getChangeRequest(id)];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                return [2 /*return*/, res.status(404).json({ error: "Change request not found" })];
                            }
                            if (existing.status !== 'draft' && existing.status !== 'returned') {
                                return [2 /*return*/, res.status(400).json({ error: "Can only submit draft or returned requests" })];
                            }
                            // Validate required fields for submission - now including target and proposed changes
                            if (!existing.title || !existing.category || !existing.vesselId || !existing.reason ||
                                !existing.targetType || !existing.targetId || !existing.snapshotBeforeJson) {
                                return [2 /*return*/, res.status(400).json({
                                        error: "Title, Category, Vessel, Reason, and Target selection are required for submission"
                                    })];
                            }
                            // Check if proposed changes exist and are non-empty
                            if (!existing.proposedChangesJson ||
                                (Array.isArray(existing.proposedChangesJson) && existing.proposedChangesJson.length === 0)) {
                                return [2 /*return*/, res.status(400).json({
                                        error: "Please propose at least one change before submitting"
                                    })];
                            }
                            return [4 /*yield*/, storage.submitChangeRequest(id, req.body.userId || 'current_user')];
                        case 2:
                            updated = _a.sent();
                            res.json(updated);
                            return [3 /*break*/, 4];
                        case 3:
                            error_23 = _a.sent();
                            res.status(500).json({ error: "Failed to submit change request" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Approve change request (office only)
            app.put("/api/modify-pms/requests/:id/approve", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, _a, comment, reviewerId, updated, error_24;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            _a = req.body, comment = _a.comment, reviewerId = _a.reviewerId;
                            if (!comment) {
                                return [2 /*return*/, res.status(400).json({ error: "Comment is required for approval" })];
                            }
                            return [4 /*yield*/, storage.approveChangeRequest(id, reviewerId || 'reviewer', comment)];
                        case 1:
                            updated = _b.sent();
                            res.json(updated);
                            return [3 /*break*/, 3];
                        case 2:
                            error_24 = _b.sent();
                            res.status(500).json({ error: error_24.message || "Failed to approve change request" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Reject change request (office only)
            app.put("/api/modify-pms/requests/:id/reject", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, _a, comment, reviewerId, updated, error_25;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            _a = req.body, comment = _a.comment, reviewerId = _a.reviewerId;
                            if (!comment) {
                                return [2 /*return*/, res.status(400).json({ error: "Comment is required for rejection" })];
                            }
                            return [4 /*yield*/, storage.rejectChangeRequest(id, reviewerId || 'reviewer', comment)];
                        case 1:
                            updated = _b.sent();
                            res.json(updated);
                            return [3 /*break*/, 3];
                        case 2:
                            error_25 = _b.sent();
                            res.status(500).json({ error: error_25.message || "Failed to reject change request" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Return change request for clarification (office only)
            app.put("/api/modify-pms/requests/:id/return", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, _a, comment, reviewerId, updated, error_26;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            _a = req.body, comment = _a.comment, reviewerId = _a.reviewerId;
                            if (!comment) {
                                return [2 /*return*/, res.status(400).json({ error: "Comment is required for return" })];
                            }
                            return [4 /*yield*/, storage.returnChangeRequest(id, reviewerId || 'reviewer', comment)];
                        case 1:
                            updated = _b.sent();
                            res.json(updated);
                            return [3 /*break*/, 3];
                        case 2:
                            error_26 = _b.sent();
                            res.status(500).json({ error: error_26.message || "Failed to return change request" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Delete change request (draft only)
            app.delete("/api/modify-pms/requests/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, error_27;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            return [4 /*yield*/, storage.deleteChangeRequest(id)];
                        case 1:
                            _a.sent();
                            res.json({ success: true });
                            return [3 /*break*/, 3];
                        case 2:
                            error_27 = _a.sent();
                            res.status(500).json({ error: error_27.message || "Failed to delete change request" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Create attachment
            app.post("/api/modify-pms/requests/:id/attachments", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var changeRequestId, _a, filename, url, uploadedByUserId, attachment, error_28;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            changeRequestId = parseInt(req.params.id);
                            _a = req.body, filename = _a.filename, url = _a.url, uploadedByUserId = _a.uploadedByUserId;
                            if (!filename || !url) {
                                return [2 /*return*/, res.status(400).json({ error: "Filename and URL are required" })];
                            }
                            return [4 /*yield*/, storage.createChangeRequestAttachment({
                                    changeRequestId: changeRequestId,
                                    filename: filename,
                                    url: url,
                                    uploadedByUserId: uploadedByUserId || 'current_user'
                                })];
                        case 1:
                            attachment = _b.sent();
                            res.json(attachment);
                            return [3 /*break*/, 3];
                        case 2:
                            error_28 = _b.sent();
                            res.status(500).json({ error: "Failed to create attachment" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Create comment
            app.post("/api/modify-pms/requests/:id/comments", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var changeRequestId, _a, message, userId, comment, error_29;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            changeRequestId = parseInt(req.params.id);
                            _a = req.body, message = _a.message, userId = _a.userId;
                            if (!message) {
                                return [2 /*return*/, res.status(400).json({ error: "Message is required" })];
                            }
                            return [4 /*yield*/, storage.createChangeRequestComment({
                                    changeRequestId: changeRequestId,
                                    userId: userId || 'current_user',
                                    message: message
                                })];
                        case 1:
                            comment = _b.sent();
                            res.json(comment);
                            return [3 /*break*/, 3];
                        case 2:
                            error_29 = _b.sent();
                            res.status(500).json({ error: "Failed to create comment" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Register bulk import routes
            app.use("/api/bulk", bulkRoutes);
            app.use("/api/alerts", alertRoutes);
            app.use("/api", formRoutes);
            app.use("/api/change-requests", createChangeRequestsRouter(storage));
            // Error handling middleware (must be last)
            app.use(notFoundHandler);
            app.use(globalErrorHandler);
            httpServer = createServer(app);
            return [2 /*return*/, httpServer];
        });
    });
}
//# sourceMappingURL=routes.js.map