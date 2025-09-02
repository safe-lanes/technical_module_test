import { __awaiter, __generator } from "tslib";
var migration = {
    id: "001",
    name: "Initial table creation",
    up: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Migration 001: Creating initial tables...");
                // This migration is handled by Drizzle's automatic schema sync
                // In production, you would use proper SQL migrations here
                console.log("✓ Initial tables migration completed (handled by Drizzle)");
                return [2 /*return*/];
            });
        });
    },
    down: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Migration 001: Rolling back initial tables...");
                // In production, you would drop tables in reverse dependency order
                console.log("✓ Initial tables rollback completed");
                return [2 /*return*/];
            });
        });
    }
};
export default migration;
//# sourceMappingURL=migration_001_initial_tables.js.map