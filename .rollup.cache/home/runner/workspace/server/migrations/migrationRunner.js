import { __awaiter, __generator } from "tslib";
import { readdir } from "fs/promises";
import { join } from "path";
var MigrationRunner = /** @class */ (function () {
    function MigrationRunner(storage) {
        this.storage = storage;
    }
    MigrationRunner.prototype.runMigrations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var migrationsPath, migrationFiles, migrations, _i, migrations_1, migrationFile, migrationModule, migration, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        migrationsPath = join(__dirname, '.');
                        return [4 /*yield*/, readdir(migrationsPath)];
                    case 1:
                        migrationFiles = _a.sent();
                        migrations = migrationFiles
                            .filter(function (file) { return file.startsWith('migration_') && file.endsWith('.ts'); })
                            .sort();
                        console.log("Found ".concat(migrations.length, " migration files"));
                        _i = 0, migrations_1 = migrations;
                        _a.label = 2;
                    case 2:
                        if (!(_i < migrations_1.length)) return [3 /*break*/, 8];
                        migrationFile = migrations_1[_i];
                        return [4 /*yield*/, import(join(migrationsPath, migrationFile))];
                    case 3:
                        migrationModule = _a.sent();
                        migration = migrationModule.default;
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, migration.up()];
                    case 5:
                        _a.sent();
                        console.log("\u2713 Migration ".concat(migration.id, " (").concat(migration.name, ") completed"));
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error("\u2717 Migration ".concat(migration.id, " failed:"), error_1);
                        throw error_1;
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    MigrationRunner.prototype.rollbackMigration = function (migrationId) {
        return __awaiter(this, void 0, void 0, function () {
            var migrationsPath, migrationFiles, migrationFile, migrationModule, migration, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        migrationsPath = join(__dirname, '.');
                        return [4 /*yield*/, readdir(migrationsPath)];
                    case 1:
                        migrationFiles = _a.sent();
                        migrationFile = migrationFiles.find(function (file) {
                            return file.includes(migrationId) && file.endsWith('.ts');
                        });
                        if (!migrationFile) {
                            throw new Error("Migration ".concat(migrationId, " not found"));
                        }
                        return [4 /*yield*/, import(join(migrationsPath, migrationFile))];
                    case 2:
                        migrationModule = _a.sent();
                        migration = migrationModule.default;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, migration.down()];
                    case 4:
                        _a.sent();
                        console.log("\u2713 Migration ".concat(migration.id, " (").concat(migration.name, ") rolled back"));
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.error("\u2717 Migration rollback ".concat(migration.id, " failed:"), error_2);
                        throw error_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return MigrationRunner;
}());
export { MigrationRunner };
//# sourceMappingURL=migrationRunner.js.map