import { __awaiter, __generator } from 'tslib';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import {
  users,
  forms,
  rankGroups,
  availableRanks,
  crewMembers,
  appraisalResults,
} from '@shared/schema';
import { eq } from 'drizzle-orm';
var DatabaseStorage = /** @class */ (function () {
  function DatabaseStorage() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    this.pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      connectionLimit: 20,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
      idleTimeout: 300000,
      queueLimit: 0,
    });
    this.db = drizzle(this.pool);
  }
  DatabaseStorage.prototype.close = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.pool.end()];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  DatabaseStorage.prototype.checkHealth = function () {
    return __awaiter(this, void 0, void 0, function () {
      var connection, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 3, , 4]);
            return [4 /*yield*/, this.pool.getConnection()];
          case 1:
            connection = _a.sent();
            return [4 /*yield*/, connection.ping()];
          case 2:
            _a.sent();
            connection.release();
            return [2 /*return*/, true];
          case 3:
            error_1 = _a.sent();
            console.error('Database health check failed:', error_1);
            return [2 /*return*/, false];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  DatabaseStorage.prototype.reconnect = function () {
    return __awaiter(this, void 0, void 0, function () {
      var error_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [4 /*yield*/, this.pool.end()];
          case 1:
            _a.sent();
            this.pool = mysql.createPool({
              uri: process.env.DATABASE_URL,
              ssl:
                process.env.NODE_ENV === 'production'
                  ? { rejectUnauthorized: false }
                  : false,
              connectionLimit: 20,
              acquireTimeout: 60000,
              timeout: 60000,
              reconnect: true,
              idleTimeout: 300000,
              queueLimit: 0,
            });
            this.db = drizzle(this.pool);
            return [3 /*break*/, 3];
          case 2:
            error_2 = _a.sent();
            console.error('Database reconnection failed:', error_2);
            throw error_2;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  // User methods
  DatabaseStorage.prototype.getUser = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db.select().from(users).where(eq(users.id, id)),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result[0]];
        }
      });
    });
  };
  DatabaseStorage.prototype.getUserByUsername = function (username) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db.select().from(users).where(eq(users.username, username)),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result[0]];
        }
      });
    });
  };
  DatabaseStorage.prototype.createUser = function (insertUser) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db.insert(users).values(insertUser).returning(),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result[0]];
        }
      });
    });
  };
  // Form methods
  DatabaseStorage.prototype.getForms = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.db.select().from(forms)];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  DatabaseStorage.prototype.getForm = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db.select().from(forms).where(eq(forms.id, id)),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result[0]];
        }
      });
    });
  };
  DatabaseStorage.prototype.createForm = function (insertForm) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db.insert(forms).values(insertForm).returning(),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result[0]];
        }
      });
    });
  };
  DatabaseStorage.prototype.updateForm = function (id, formData) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db
                .update(forms)
                .set(formData)
                .where(eq(forms.id, id))
                .returning(),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result[0]];
        }
      });
    });
  };
  DatabaseStorage.prototype.deleteForm = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.db.delete(forms).where(eq(forms.id, id))];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result.affectedRows > 0];
        }
      });
    });
  };
  // Rank Group methods
  DatabaseStorage.prototype.getRankGroups = function (formId) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db
                .select()
                .from(rankGroups)
                .where(eq(rankGroups.formId, formId)),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  DatabaseStorage.prototype.createRankGroup = function (insertRankGroup) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db.insert(rankGroups).values(insertRankGroup).returning(),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result[0]];
        }
      });
    });
  };
  DatabaseStorage.prototype.updateRankGroup = function (id, rankGroupData) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db
                .update(rankGroups)
                .set(rankGroupData)
                .where(eq(rankGroups.id, id))
                .returning(),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result[0]];
        }
      });
    });
  };
  DatabaseStorage.prototype.deleteRankGroup = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db.delete(rankGroups).where(eq(rankGroups.id, id)),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result.affectedRows > 0];
        }
      });
    });
  };
  // Available Rank methods
  DatabaseStorage.prototype.getAvailableRanks = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.db.select().from(availableRanks)];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  DatabaseStorage.prototype.createAvailableRank = function (
    insertAvailableRank
  ) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db
                .insert(availableRanks)
                .values(insertAvailableRank)
                .returning(),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result[0]];
        }
      });
    });
  };
  // Crew Member methods
  DatabaseStorage.prototype.getCrewMembers = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.db.select().from(crewMembers)];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  DatabaseStorage.prototype.getCrewMember = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db.select().from(crewMembers).where(eq(crewMembers.id, id)),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result[0]];
        }
      });
    });
  };
  DatabaseStorage.prototype.createCrewMember = function (insertCrewMember) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db.insert(crewMembers).values(insertCrewMember).returning(),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result[0]];
        }
      });
    });
  };
  DatabaseStorage.prototype.updateCrewMember = function (id, crewMemberData) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db
                .update(crewMembers)
                .set(crewMemberData)
                .where(eq(crewMembers.id, id))
                .returning(),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result[0]];
        }
      });
    });
  };
  DatabaseStorage.prototype.deleteCrewMember = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db.delete(crewMembers).where(eq(crewMembers.id, id)),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result.affectedRows > 0];
        }
      });
    });
  };
  // Appraisal Result methods
  DatabaseStorage.prototype.getAppraisalResults = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.db.select().from(appraisalResults)];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  DatabaseStorage.prototype.getAppraisalResult = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db
                .select()
                .from(appraisalResults)
                .where(eq(appraisalResults.id, id)),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result[0]];
        }
      });
    });
  };
  DatabaseStorage.prototype.getAppraisalResultsByCrewMember = function (
    crewMemberId
  ) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db
                .select()
                .from(appraisalResults)
                .where(eq(appraisalResults.crewMemberId, crewMemberId)),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  DatabaseStorage.prototype.createAppraisalResult = function (
    insertAppraisalResult
  ) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db
                .insert(appraisalResults)
                .values(insertAppraisalResult)
                .returning(),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result[0]];
        }
      });
    });
  };
  DatabaseStorage.prototype.updateAppraisalResult = function (
    id,
    appraisalResultData
  ) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db
                .update(appraisalResults)
                .set(appraisalResultData)
                .where(eq(appraisalResults.id, id))
                .returning(),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result[0]];
        }
      });
    });
  };
  DatabaseStorage.prototype.deleteAppraisalResult = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.db
                .delete(appraisalResults)
                .where(eq(appraisalResults.id, id)),
            ];
          case 1:
            result = _a.sent();
            return [2 /*return*/, result.affectedRows > 0];
        }
      });
    });
  };
  // Seed data for initial setup
  DatabaseStorage.prototype.seedDatabase = function () {
    return __awaiter(this, void 0, void 0, function () {
      var existingForms,
        rankData,
        _i,
        rankData_1,
        rank,
        form,
        crewMemberData,
        _a,
        crewMemberData_1,
        crewMember,
        appraisalData,
        _b,
        appraisalData_1,
        appraisal,
        error_3;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            _c.trys.push([0, 16, , 17]);
            return [4 /*yield*/, this.getForms()];
          case 1:
            existingForms = _c.sent();
            if (existingForms.length > 0) {
              console.log('Database already seeded, skipping...');
              return [2 /*return*/];
            }
            rankData = [
              { name: 'Master', category: 'Senior Officers' },
              { name: 'Chief Officer', category: 'Senior Officers' },
              { name: 'Chief Engineer', category: 'Senior Officers' },
              { name: '2nd Officer', category: 'Junior Officers' },
              { name: '3rd Officer', category: 'Junior Officers' },
              { name: '2nd Engineer', category: 'Junior Officers' },
              { name: '3rd Engineer', category: 'Junior Officers' },
              { name: 'Bosun', category: 'Ratings' },
              { name: 'AB', category: 'Ratings' },
              { name: 'OS', category: 'Ratings' },
              { name: 'Oiler', category: 'Ratings' },
              { name: 'Wiper', category: 'Ratings' },
            ];
            ((_i = 0), (rankData_1 = rankData));
            _c.label = 2;
          case 2:
            if (!(_i < rankData_1.length)) return [3 /*break*/, 5];
            rank = rankData_1[_i];
            return [4 /*yield*/, this.createAvailableRank(rank)];
          case 3:
            _c.sent();
            _c.label = 4;
          case 4:
            _i++;
            return [3 /*break*/, 2];
          case 5:
            return [
              4 /*yield*/,
              this.createForm({
                name: 'Crew Appraisal Form',
                rankGroup: 'Senior Officers',
                versionNo: '01',
                versionDate: '01-Jan-2025',
                configuration: null,
              }),
            ];
          case 6:
            form = _c.sent();
            // Seed rank groups
            return [
              4 /*yield*/,
              this.createRankGroup({
                formId: form.id,
                name: 'Senior Officers',
                ranks: JSON.stringify([
                  'Master',
                  'Chief Officer',
                  'Chief Engineer',
                ]),
              }),
            ];
          case 7:
            // Seed rank groups
            _c.sent();
            crewMemberData = [
              {
                id: '2025-05-14',
                firstName: 'James',
                middleName: 'Michael',
                lastName: '',
                rank: 'Master',
                nationality: 'British',
                vessel: 'MT Sail One',
                vesselType: 'Oil Tanker',
                signOnDate: '01-Feb-2025',
              },
              {
                id: '2025-03-12',
                firstName: 'Anna',
                middleName: 'Marie',
                lastName: 'Johnson',
                rank: 'Chief Engineer',
                nationality: 'British',
                vessel: 'MT Sail Ten',
                vesselType: 'LPG Tanker',
                signOnDate: '01-Jan-2025',
              },
              {
                id: '2025-02-12',
                firstName: 'David',
                middleName: 'Lee',
                lastName: 'Brown',
                rank: 'Able Seaman',
                nationality: 'Indian',
                vessel: 'MT Sail Two',
                vesselType: 'Container',
                signOnDate: '01-Feb-2025',
              },
            ];
            ((_a = 0), (crewMemberData_1 = crewMemberData));
            _c.label = 8;
          case 8:
            if (!(_a < crewMemberData_1.length)) return [3 /*break*/, 11];
            crewMember = crewMemberData_1[_a];
            return [4 /*yield*/, this.createCrewMember(crewMember)];
          case 9:
            _c.sent();
            _c.label = 10;
          case 10:
            _a++;
            return [3 /*break*/, 8];
          case 11:
            appraisalData = [
              {
                crewMemberId: '2025-05-14',
                formId: form.id,
                appraisalType: 'End of Contract',
                appraisalDate: '06-Jun-2025',
                appraisalData: '{}',
                competenceRating: '4.9',
                behavioralRating: '4.5',
                overallRating: '4.7',
                submittedBy: 'admin',
                status: 'submitted',
              },
              {
                crewMemberId: '2025-03-12',
                formId: form.id,
                appraisalType: 'Mid Term',
                appraisalDate: '07-May-2025',
                appraisalData: '{}',
                competenceRating: '3.5',
                behavioralRating: '4.5',
                overallRating: '4.0',
                submittedBy: 'admin',
                status: 'submitted',
              },
              {
                crewMemberId: '2025-02-12',
                formId: form.id,
                appraisalType: 'Special',
                appraisalDate: '06-Jun-2025',
                appraisalData: '{}',
                competenceRating: '2.5',
                behavioralRating: '3.5',
                overallRating: '3.0',
                submittedBy: 'admin',
                status: 'submitted',
              },
            ];
            ((_b = 0), (appraisalData_1 = appraisalData));
            _c.label = 12;
          case 12:
            if (!(_b < appraisalData_1.length)) return [3 /*break*/, 15];
            appraisal = appraisalData_1[_b];
            return [4 /*yield*/, this.createAppraisalResult(appraisal)];
          case 13:
            _c.sent();
            _c.label = 14;
          case 14:
            _b++;
            return [3 /*break*/, 12];
          case 15:
            console.log('Database seeded successfully!');
            return [3 /*break*/, 17];
          case 16:
            error_3 = _c.sent();
            console.error('Error seeding database:', error_3);
            throw error_3;
          case 17:
            return [2 /*return*/];
        }
      });
    });
  };
  return DatabaseStorage;
})();
export { DatabaseStorage };
//# sourceMappingURL=database.js.map
