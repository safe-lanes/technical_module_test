import { __assign, __awaiter, __generator, __makeTemplateObject } from "tslib";
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { users, components, runningHoursAudit, spares, sparesHistory, storesLedger, changeRequest, changeRequestAttachment, changeRequestComment, workOrders, } from '@shared/schema';
import { desc } from 'drizzle-orm';
import { eq, sql } from 'drizzle-orm';
// Console logging for database operations
function logDbOperation(operation, data) {
    console.log("\uD83D\uDD04 MySQL DB Operation: ".concat(operation), data ? "".concat(JSON.stringify(data).slice(0, 100), "...") : '');
}
var DatabaseStorage = /** @class */ (function () {
    function DatabaseStorage() {
        // Use MySQL RDS environment variables
        var host = process.env.MYSQL_HOST;
        var database = process.env.MYSQL_DATABASE;
        var user = process.env.MYSQL_USER;
        var password = process.env.MYSQL_PASSWORD;
        var port = parseInt(process.env.MYSQL_PORT || '3306');
        if (!host || !database || !user || !password) {
            throw new Error('MySQL environment variables are required (MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD)');
        }
        console.log('✅ Technical Module using MySQL RDS database for persistent storage');
        // Create MySQL connection pool
        this.pool = mysql.createPool({
            host: host,
            port: port,
            user: user,
            password: password,
            database: database,
            waitForConnections: true,
            connectionLimit: 20,
            queueLimit: 0,
            acquireTimeout: 60000,
            timeout: 60000,
        });
        // Create drizzle instance
        this.db = drizzle(this.pool, {
            schema: {
                users: users,
                components: components,
                runningHoursAudit: runningHoursAudit,
                spares: spares,
                sparesHistory: sparesHistory,
                storesLedger: storesLedger,
                changeRequest: changeRequest,
                changeRequestAttachment: changeRequestAttachment,
                changeRequestComment: changeRequestComment,
                workOrders: workOrders,
            },
            mode: 'default',
        });
    }
    DatabaseStorage.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.end()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.healthCheck = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.pool.getConnection()];
                    case 1:
                        connection = _a.sent();
                        return [4 /*yield*/, connection.execute('SELECT 1')];
                    case 2:
                        _a.sent();
                        connection.release();
                        return [2 /*return*/, true];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Database health check failed:', error_1);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Basic user operations for authentication
    DatabaseStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select().from(users).where(eq(users.id, id))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select()
                            .from(users)
                            .where(eq(users.username, username))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.createUser = function (insertUser) {
        return __awaiter(this, void 0, void 0, function () {
            var result, insertId, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.insert(users).values(insertUser)];
                    case 1:
                        result = _a.sent();
                        insertId = result.insertId;
                        return [4 /*yield*/, this.db
                                .select()
                                .from(users)
                                .where(eq(users.id, insertId))];
                    case 2:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    // Components
    DatabaseStorage.prototype.getComponents = function (vesselId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logDbOperation('getComponents', { vesselId: vesselId });
                        if (!vesselId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db
                                .select()
                                .from(components)
                                .where(eq(components.vesselId, vesselId))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.db.select().from(components)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getComponent = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var component;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select()
                            .from(components)
                            .where(eq(components.id, id))];
                    case 1:
                        component = (_a.sent())[0];
                        return [2 /*return*/, component || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.createComponent = function (insertComponent) {
        return __awaiter(this, void 0, void 0, function () {
            var component;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.insert(components).values(insertComponent)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db
                                .select()
                                .from(components)
                                .where(eq(components.id, insertComponent.id))];
                    case 2:
                        component = (_a.sent())[0];
                        return [2 /*return*/, component];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateComponent = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var component;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.update(components).set(updates).where(eq(components.id, id))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db
                                .select()
                                .from(components)
                                .where(eq(components.id, id))];
                    case 2:
                        component = (_a.sent())[0];
                        return [2 /*return*/, component];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteComponent = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.delete(components).where(eq(components.id, id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Running Hours
    DatabaseStorage.prototype.getRunningHoursAudit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select().from(runningHoursAudit)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getRunningHoursAudits = function (componentId, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.db
                            .select()
                            .from(runningHoursAudit)
                            .where(eq(runningHoursAudit.componentId, componentId));
                        if (limit) {
                            query = query.limit(limit);
                        }
                        return [4 /*yield*/, query];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getRunningHoursAuditsInDateRange = function (componentId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select()
                            .from(runningHoursAudit)
                            .where(eq(runningHoursAudit.componentId, componentId))
                            .where(sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " >= ", ""], ["", " >= ", ""])), runningHoursAudit.enteredAtUTC, startDate))
                            .where(sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", " <= ", ""], ["", " <= ", ""])), runningHoursAudit.enteredAtUTC, endDate))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createRunningHoursAudit = function (insertAudit) {
        return __awaiter(this, void 0, void 0, function () {
            var result, insertId, audit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.insert(runningHoursAudit).values(insertAudit)];
                    case 1:
                        result = _a.sent();
                        insertId = result.insertId;
                        return [4 /*yield*/, this.db
                                .select()
                                .from(runningHoursAudit)
                                .where(eq(runningHoursAudit.id, insertId))];
                    case 2:
                        audit = (_a.sent())[0];
                        return [2 /*return*/, audit];
                }
            });
        });
    };
    // Spares
    DatabaseStorage.prototype.getSpares = function (vesselId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logDbOperation('getSpares', { vesselId: vesselId });
                        if (!vesselId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db
                                .select()
                                .from(spares)
                                .where(eq(spares.vesselId, vesselId))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.db.select().from(spares)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getSpare = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var spare;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select()
                            .from(spares)
                            .where(eq(spares.id, id))];
                    case 1:
                        spare = (_a.sent())[0];
                        return [2 /*return*/, spare || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.createSpare = function (insertSpare) {
        return __awaiter(this, void 0, void 0, function () {
            var result, insertId, spare;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logDbOperation('createSpare', insertSpare);
                        return [4 /*yield*/, this.db.insert(spares).values(insertSpare)];
                    case 1:
                        result = _a.sent();
                        insertId = result.insertId;
                        return [4 /*yield*/, this.db
                                .select()
                                .from(spares)
                                .where(eq(spares.id, insertId))];
                    case 2:
                        spare = (_a.sent())[0];
                        return [2 /*return*/, spare];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateSpare = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var spare;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logDbOperation('updateSpare', { id: id, updates: updates });
                        return [4 /*yield*/, this.db.update(spares).set(updates).where(eq(spares.id, id))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db
                                .select()
                                .from(spares)
                                .where(eq(spares.id, id))];
                    case 2:
                        spare = (_a.sent())[0];
                        return [2 /*return*/, spare];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteSpare = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.delete(spares).where(eq(spares.id, id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Spares History
    DatabaseStorage.prototype.getSparesHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select().from(sparesHistory)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createSpareHistory = function (insertHistory) {
        return __awaiter(this, void 0, void 0, function () {
            var result, insertId, history;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.insert(sparesHistory).values(insertHistory)];
                    case 1:
                        result = _a.sent();
                        insertId = result.insertId;
                        return [4 /*yield*/, this.db
                                .select()
                                .from(sparesHistory)
                                .where(eq(sparesHistory.id, insertId))];
                    case 2:
                        history = (_a.sent())[0];
                        return [2 /*return*/, history];
                }
            });
        });
    };
    // Stores Ledger
    DatabaseStorage.prototype.getStoresLedger = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select().from(storesLedger)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createStoresLedgerEntry = function (insertLedger) {
        return __awaiter(this, void 0, void 0, function () {
            var result, insertId, ledger;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.insert(storesLedger).values(insertLedger)];
                    case 1:
                        result = _a.sent();
                        insertId = result.insertId;
                        return [4 /*yield*/, this.db
                                .select()
                                .from(storesLedger)
                                .where(eq(storesLedger.id, insertId))];
                    case 2:
                        ledger = (_a.sent())[0];
                        return [2 /*return*/, ledger];
                }
            });
        });
    };
    // Change Requests - using filtered version below
    DatabaseStorage.prototype.getChangeRequest = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select()
                            .from(changeRequest)
                            .where(eq(changeRequest.id, id))];
                    case 1:
                        cr = (_a.sent())[0];
                        return [2 /*return*/, cr || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.createChangeRequest = function (insertCR) {
        return __awaiter(this, void 0, void 0, function () {
            var result, insertId, cr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.insert(changeRequest).values(insertCR)];
                    case 1:
                        result = _a.sent();
                        insertId = result.insertId;
                        return [4 /*yield*/, this.db
                                .select()
                                .from(changeRequest)
                                .where(eq(changeRequest.id, insertId))];
                    case 2:
                        cr = (_a.sent())[0];
                        return [2 /*return*/, cr];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateChangeRequest = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var cr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .update(changeRequest)
                            .set(updates)
                            .where(eq(changeRequest.id, id))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db
                                .select()
                                .from(changeRequest)
                                .where(eq(changeRequest.id, id))];
                    case 2:
                        cr = (_a.sent())[0];
                        return [2 /*return*/, cr];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteChangeRequest = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.delete(changeRequest).where(eq(changeRequest.id, id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Additional methods required by IStorage
    DatabaseStorage.prototype.consumeSpare = function (id, quantity, userId, remarks, place, dateLocal, tz) {
        return __awaiter(this, void 0, void 0, function () {
            var spare, newRob, updatedSpare;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSpare(id)];
                    case 1:
                        spare = _a.sent();
                        if (!spare)
                            throw new Error('Spare not found');
                        newRob = spare.rob - quantity;
                        return [4 /*yield*/, this.updateSpare(id, { rob: newRob })];
                    case 2:
                        updatedSpare = _a.sent();
                        // Create history entry
                        return [4 /*yield*/, this.createSpareHistory({
                                timestampUTC: new Date(),
                                vesselId: spare.vesselId,
                                spareId: id,
                                partCode: spare.partCode,
                                partName: spare.partName,
                                componentId: spare.componentId,
                                componentCode: spare.componentCode,
                                componentName: spare.componentName,
                                componentSpareCode: spare.componentSpareCode,
                                eventType: 'CONSUME',
                                qtyChange: -quantity,
                                robAfter: newRob,
                                userId: userId,
                                remarks: remarks || null,
                                reference: null,
                                dateLocal: dateLocal || null,
                                tz: tz || null,
                                place: place || null,
                            })];
                    case 3:
                        // Create history entry
                        _a.sent();
                        return [2 /*return*/, updatedSpare];
                }
            });
        });
    };
    DatabaseStorage.prototype.receiveSpare = function (id, quantity, userId, remarks, supplierPO, place, dateLocal, tz) {
        return __awaiter(this, void 0, void 0, function () {
            var spare, newRob, updatedSpare;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSpare(id)];
                    case 1:
                        spare = _a.sent();
                        if (!spare)
                            throw new Error('Spare not found');
                        newRob = spare.rob + quantity;
                        return [4 /*yield*/, this.updateSpare(id, { rob: newRob })];
                    case 2:
                        updatedSpare = _a.sent();
                        // Create history entry
                        return [4 /*yield*/, this.createSpareHistory({
                                timestampUTC: new Date(),
                                vesselId: spare.vesselId,
                                spareId: id,
                                partCode: spare.partCode,
                                partName: spare.partName,
                                componentId: spare.componentId,
                                componentCode: spare.componentCode,
                                componentName: spare.componentName,
                                componentSpareCode: spare.componentSpareCode,
                                eventType: 'RECEIVE',
                                qtyChange: quantity,
                                robAfter: newRob,
                                userId: userId,
                                remarks: remarks || null,
                                reference: supplierPO || null,
                                dateLocal: dateLocal || null,
                                tz: tz || null,
                                place: place || null,
                            })];
                    case 3:
                        // Create history entry
                        _a.sent();
                        return [2 /*return*/, updatedSpare];
                }
            });
        });
    };
    DatabaseStorage.prototype.bulkUpdateSpares = function (updates, userId, remarks) {
        return __awaiter(this, void 0, void 0, function () {
            var results, _i, updates_1, update, result, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = [];
                        _i = 0, updates_1 = updates;
                        _a.label = 1;
                    case 1:
                        if (!(_i < updates_1.length)) return [3 /*break*/, 6];
                        update = updates_1[_i];
                        if (!update.consumed) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.consumeSpare(update.id, update.consumed, userId, remarks)];
                    case 2:
                        result = _a.sent();
                        results.push(result);
                        _a.label = 3;
                    case 3:
                        if (!update.received) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.receiveSpare(update.id, update.received, userId, remarks, undefined, update.receivedPlace, update.receivedDate)];
                    case 4:
                        result = _a.sent();
                        results.push(result);
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, results];
                }
            });
        });
    };
    DatabaseStorage.prototype.getSpareHistory = function (vesselId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select()
                            .from(sparesHistory)
                            .where(eq(sparesHistory.vesselId, vesselId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getSpareHistoryBySpareId = function (spareId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select()
                            .from(sparesHistory)
                            .where(eq(sparesHistory.spareId, spareId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Store Ledger methods
    DatabaseStorage.prototype.getStoreItems = function (vesselId) {
        return __awaiter(this, void 0, void 0, function () {
            var allTransactions, itemsMap, _i, allTransactions_1, transaction, itemCode, catalogInfo, item, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logDbOperation('getStoreItems', { vesselId: vesselId });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.db
                                .select()
                                .from(storesLedger)
                                .where(eq(storesLedger.vesselId, vesselId))
                                .orderBy(desc(storesLedger.timestampUTC))];
                    case 2:
                        allTransactions = _a.sent();
                        itemsMap = new Map();
                        for (_i = 0, allTransactions_1 = allTransactions; _i < allTransactions_1.length; _i++) {
                            transaction = allTransactions_1[_i];
                            itemCode = transaction.itemCode;
                            if (!itemsMap.has(itemCode)) {
                                // Initialize with basic info
                                itemsMap.set(itemCode, {
                                    item_code: transaction.itemCode,
                                    item_name: transaction.itemName,
                                    uom: transaction.unit,
                                    rob: parseFloat(transaction.robAfter.toString()),
                                    min_stock: 1, // Default
                                    location: transaction.place || 'Store Room',
                                    category: 'stores',
                                    notes: '',
                                });
                            }
                            // Update with latest catalog info if this is a CATALOG_UPDATE
                            if (transaction.eventType === 'CATALOG_UPDATE' && transaction.remarks) {
                                try {
                                    catalogInfo = JSON.parse(transaction.remarks);
                                    item = itemsMap.get(itemCode);
                                    item.min_stock = catalogInfo.minStock || 1;
                                    item.notes = catalogInfo.notes || '';
                                    item.location = catalogInfo.location || item.location;
                                }
                                catch (e) {
                                    // Ignore invalid JSON
                                }
                            }
                        }
                        result = Array.from(itemsMap.values()).map(function (item) { return (__assign(__assign({}, item), { stock: item.rob <= item.min_stock
                                ? 'Minimum'
                                : item.rob <= item.min_stock * 1.5
                                    ? 'Low'
                                    : 'OK' })); });
                        return [2 /*return*/, result];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error fetching store items:', error_2);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.createStoreTransaction = function (transaction) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logDbOperation('createStoreTransaction', transaction);
                        return [4 /*yield*/, this.db.insert(storesLedger).values(transaction)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, transaction]; // MySQL doesn't support returning, so return the original transaction
                }
            });
        });
    };
    DatabaseStorage.prototype.getStoreHistory = function (vesselId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logDbOperation('getStoreHistory', { vesselId: vesselId });
                        return [4 /*yield*/, this.db
                                .select()
                                .from(storesLedger)
                                .where(eq(storesLedger.vesselId, vesselId))
                                .orderBy(desc(storesLedger.timestampUTC))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateStoreItem = function (vesselId, itemCode, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var currentItems, currentItem, catalogInfo, editTransaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logDbOperation('updateStoreItem', { vesselId: vesselId, itemCode: itemCode, updates: updates });
                        return [4 /*yield*/, this.getStoreItems(vesselId)];
                    case 1:
                        currentItems = _a.sent();
                        currentItem = currentItems.find(function (item) { return item.item_code === itemCode; });
                        if (!currentItem) {
                            throw new Error('Store item not found');
                        }
                        catalogInfo = {
                            minStock: updates.minStock,
                            notes: updates.notes,
                            location: updates.location,
                            updatedAt: new Date().toISOString(),
                        };
                        editTransaction = {
                            vesselId: vesselId,
                            itemCode: itemCode,
                            itemName: updates.itemName,
                            unit: updates.uom,
                            eventType: 'CATALOG_UPDATE',
                            quantity: 0,
                            robAfter: currentItem.rob, // Keep same ROB
                            place: updates.location || '',
                            dateLocal: new Date().toISOString().split('T')[0],
                            tz: 'UTC',
                            timestampUTC: new Date(),
                            userId: 'system',
                            remarks: JSON.stringify(catalogInfo),
                        };
                        return [4 /*yield*/, this.db.insert(storesLedger).values(editTransaction)];
                    case 2:
                        _a.sent();
                        // Force cache invalidation by adding a timestamp to response
                        return [2 /*return*/, __assign(__assign({}, editTransaction), { success: true, timestamp: new Date().getTime(), updatedFields: updates })];
                }
            });
        });
    };
    // Placeholder implementations for remaining IStorage methods
    DatabaseStorage.prototype.getChangeRequests = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.db.select().from(changeRequest);
                        if (filters === null || filters === void 0 ? void 0 : filters.vesselId) {
                            query = query.where(eq(changeRequest.vesselId, filters.vesselId));
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.status) {
                            query = query.where(eq(changeRequest.status, filters.status));
                        }
                        return [4 /*yield*/, query];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Stub methods - will implement as needed
    DatabaseStorage.prototype.getChangeRequestAttachments = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []];
            });
        });
    };
    DatabaseStorage.prototype.getChangeRequestComments = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []];
            });
        });
    };
    DatabaseStorage.prototype.updateChangeRequestTarget = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    DatabaseStorage.prototype.updateChangeRequestProposed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    DatabaseStorage.prototype.submitChangeRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    DatabaseStorage.prototype.approveChangeRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    DatabaseStorage.prototype.rejectChangeRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    DatabaseStorage.prototype.returnChangeRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    DatabaseStorage.prototype.createChangeRequestAttachment = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    DatabaseStorage.prototype.createChangeRequestComment = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    // Work Orders methods
    DatabaseStorage.prototype.getWorkOrders = function (vesselId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logDbOperation('getWorkOrders', { vesselId: vesselId });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 6]);
                        return [4 /*yield*/, this.db
                                .select()
                                .from(workOrders)
                                .where(eq(workOrders.vesselId, vesselId))
                                .orderBy(desc(workOrders.createdAt))];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Failed to get work orders:', error_3);
                        if (!(error_3 instanceof Error && error_3.message.includes("doesn't exist"))) return [3 /*break*/, 5];
                        logDbOperation('getWorkOrders - table not found, creating table', {});
                        return [4 /*yield*/, this.createWorkOrdersTable()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 5: throw error_3;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.createWorkOrdersTable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.pool.getConnection()];
                    case 1:
                        connection = _a.sent();
                        return [4 /*yield*/, connection.execute("\n        CREATE TABLE IF NOT EXISTS work_orders (\n          id VARCHAR(100) PRIMARY KEY,\n          vessel_id VARCHAR(50) NOT NULL DEFAULT 'V001',\n          component VARCHAR(255) NOT NULL,\n          component_code VARCHAR(100),\n          work_order_no VARCHAR(50) NOT NULL,\n          template_code VARCHAR(100),\n          execution_id VARCHAR(100),\n          job_title VARCHAR(500) NOT NULL,\n          assigned_to VARCHAR(255) NOT NULL,\n          due_date VARCHAR(50) NOT NULL,\n          status VARCHAR(50) NOT NULL,\n          date_completed VARCHAR(50),\n          submitted_date VARCHAR(50),\n          form_data JSON,\n          task_type VARCHAR(100),\n          maintenance_basis VARCHAR(50),\n          frequency_value VARCHAR(50),\n          frequency_unit VARCHAR(50),\n          approver_remarks TEXT,\n          is_execution BOOLEAN DEFAULT FALSE,\n          template_id VARCHAR(100),\n          approver VARCHAR(255),\n          approval_date VARCHAR(50),\n          rejection_date VARCHAR(50),\n          next_due_date VARCHAR(50),\n          next_due_reading VARCHAR(50),\n          current_reading VARCHAR(50),\n          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n          INDEX idx_wo_vessel (vessel_id),\n          INDEX idx_wo_status (status),\n          INDEX idx_wo_component (component_code),\n          INDEX idx_wo_due_date (due_date)\n        )\n      ")];
                    case 2:
                        _a.sent();
                        connection.release();
                        console.log('✅ Created work_orders table in MySQL RDS');
                        console.log('✅ Work orders table ready for use');
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error('❌ Failed to create work_orders table:', error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.seedWorkOrdersData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sampleWorkOrder, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        sampleWorkOrder = {
                            id: 'test-wo',
                            vesselId: 'V001',
                            component: 'Main Engine',
                            componentCode: 'ME-001',
                            workOrderNo: 'WO-2025-001',
                            templateCode: 'WO-ME-001-INSM1',
                            jobTitle: 'Monthly Engine Inspection',
                            assignedTo: 'Chief Engineer',
                            dueDate: '2025-12-31',
                            status: 'Due',
                            taskType: 'Inspection',
                            maintenanceBasis: 'Calendar',
                            frequencyValue: '1',
                            frequencyUnit: 'Months',
                            formData: {
                                woTitle: 'Monthly Engine Inspection',
                                component: 'Main Engine',
                                componentCode: 'ME-001',
                            },
                        };
                        return [4 /*yield*/, this.createWorkOrder(sampleWorkOrder)];
                    case 1:
                        _a.sent();
                        console.log('✅ Seeded sample work order data');
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error('❌ Failed to seed work order data:', error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.createWorkOrder = function (workOrderData) {
        return __awaiter(this, void 0, void 0, function () {
            var newWorkOrder, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logDbOperation('createWorkOrder', workOrderData);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.db.insert(workOrders).values(workOrderData)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.db
                                .select()
                                .from(workOrders)
                                .where(eq(workOrders.id, workOrderData.id))
                                .limit(1)];
                    case 3:
                        newWorkOrder = (_a.sent())[0];
                        return [2 /*return*/, newWorkOrder];
                    case 4:
                        error_6 = _a.sent();
                        console.error('Failed to create work order:', error_6);
                        throw error_6;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateWorkOrder = function (workOrderId, workOrderData) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedWorkOrder, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logDbOperation('updateWorkOrder', __assign({ workOrderId: workOrderId }, workOrderData));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.db
                                .update(workOrders)
                                .set(workOrderData)
                                .where(eq(workOrders.id, workOrderId))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.db
                                .select()
                                .from(workOrders)
                                .where(eq(workOrders.id, workOrderId))
                                .limit(1)];
                    case 3:
                        updatedWorkOrder = (_a.sent())[0];
                        return [2 /*return*/, updatedWorkOrder];
                    case 4:
                        error_7 = _a.sent();
                        console.error('Failed to update work order:', error_7);
                        throw error_7;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteWorkOrder = function (workOrderId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logDbOperation('deleteWorkOrder', { workOrderId: workOrderId });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.db.delete(workOrders).where(eq(workOrders.id, workOrderId))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        console.error('Failed to delete work order:', error_8);
                        throw error_8;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DatabaseStorage;
}());
export { DatabaseStorage };
// Export singleton instance
export var storage = new DatabaseStorage();
console.log('✅ Technical Module using MySQL RDS database for persistent storage');
// Seed some test store data if tables are empty
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var existingStores, sampleStoreTransactions, _i, sampleStoreTransactions_1, transaction, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4 /*yield*/, storage.getStoreItems('V001')];
            case 1:
                existingStores = _a.sent();
                if (!(existingStores.length === 0)) return [3 /*break*/, 6];
                console.log('🌱 Seeding test store data into MySQL...');
                sampleStoreTransactions = [
                    {
                        vesselId: 'V001',
                        itemCode: 'ST-TOOL-001',
                        itemName: 'Torque Wrench',
                        unit: 'pcs',
                        eventType: 'INITIAL',
                        quantity: 2,
                        robAfter: 2,
                        place: 'Store Room A',
                        dateLocal: '2025-09-03 05:00:00',
                        tz: 'UTC',
                        timestampUTC: new Date(),
                        userId: 'system',
                        remarks: 'Initial stock',
                    },
                    {
                        vesselId: 'V001',
                        itemCode: 'ST-CONS-001',
                        itemName: 'Cotton Rags',
                        unit: 'kg',
                        eventType: 'INITIAL',
                        quantity: 5,
                        robAfter: 5,
                        place: 'Store Room B',
                        dateLocal: '2025-09-03 05:00:00',
                        tz: 'UTC',
                        timestampUTC: new Date(),
                        userId: 'system',
                        remarks: 'Initial stock',
                    },
                    {
                        vesselId: 'V001',
                        itemCode: 'ST-SEAL-001',
                        itemName: 'O-Ring Set',
                        unit: 'set',
                        eventType: 'INITIAL',
                        quantity: 3,
                        robAfter: 3,
                        place: 'Store Room B',
                        dateLocal: '2025-09-03 05:00:00',
                        tz: 'UTC',
                        timestampUTC: new Date(),
                        userId: 'system',
                        remarks: 'Initial stock',
                    },
                ];
                _i = 0, sampleStoreTransactions_1 = sampleStoreTransactions;
                _a.label = 2;
            case 2:
                if (!(_i < sampleStoreTransactions_1.length)) return [3 /*break*/, 5];
                transaction = sampleStoreTransactions_1[_i];
                return [4 /*yield*/, storage.createStoreTransaction(transaction)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                console.log('✅ Test store data seeded successfully');
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_9 = _a.sent();
                console.error('Error seeding store data:', error_9);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); })();
var templateObject_1, templateObject_2;
//# sourceMappingURL=database.js.map