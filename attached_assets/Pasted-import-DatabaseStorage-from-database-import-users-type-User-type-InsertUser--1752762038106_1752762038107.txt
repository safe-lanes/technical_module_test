import { DatabaseStorage } from "./database"; 
import { 
  users, 
  type User, 
  type InsertUser, 
  type Form, 
  type InsertForm, 
  type RankGroup, 
  type InsertRankGroup, 
  type AvailableRank, 
  type InsertAvailableRank, 
  type CrewMember, 
  type InsertCrewMember, 
  type AppraisalResult, 
  type InsertAppraisalResult 
} from "@shared/schema";

// Interface for CRUD operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getForms(): Promise<Form[]>;
  getForm(id: number): Promise<Form | undefined>;
  createForm(form: InsertForm): Promise<Form>;
  updateForm(id: number, form: Partial<InsertForm>): Promise<Form | undefined>;
  deleteForm(id: number): Promise<boolean>;
  getRankGroups(formId: number): Promise<RankGroup[]>;
  createRankGroup(rankGroup: InsertRankGroup): Promise<RankGroup>;
  updateRankGroup(id: number, rankGroup: Partial<InsertRankGroup>): Promise<RankGroup | undefined>;
  deleteRankGroup(id: number): Promise<boolean>;
  getAvailableRanks(): Promise<AvailableRank[]>;
  createAvailableRank(rank: InsertAvailableRank): Promise<AvailableRank>;
  getCrewMembers(): Promise<CrewMember[]>;
  getCrewMember(id: string): Promise<CrewMember | undefined>;
  createCrewMember(crewMember: InsertCrewMember): Promise<CrewMember>;
  updateCrewMember(id: string, crewMember: Partial<InsertCrewMember>): Promise<CrewMember | undefined>;
  deleteCrewMember(id: string): Promise<boolean>;
  getAppraisalResults(): Promise<AppraisalResult[]>;
  getAppraisalResult(id: number): Promise<AppraisalResult | undefined>;
  createAppraisalResult(appraisalResult: InsertAppraisalResult): Promise<AppraisalResult>;
  updateAppraisalResult(id: number, appraisalResult: Partial<InsertAppraisalResult>): Promise<AppraisalResult | undefined>;
  deleteAppraisalResult(id: number): Promise<boolean>;
}

// Initialize storage with MySQL or in-memory
let storage: IStorage;

if (process.env.DATABASE_URL) {
  try {
    storage = new DatabaseStorage();
    (async () => {
      try {
        await (storage as DatabaseStorage).seedDatabase();
        console.log("✅ MySQL database connected and seeded successfully");
      } catch (error) {
        console.error("Failed to seed database:", error);
        storage = new MemStorage();
      }
    })();
  } catch (error) {
    console.error("Failed to initialize MySQL database:", error);
    storage = new MemStorage();
  }
} else {
  storage = new MemStorage();
  console.log("ℹ️  No DATABASE_URL found, using in-memory storage for development");
}

export { storage };

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private forms: Map<number, Form>;
  private rankGroups: Map<number, RankGroup>;
  private availableRanks: Map<number, AvailableRank>;
  private crewMembers: Map<string, CrewMember>;
  private appraisalResults: Map<number, AppraisalResult>;
  private currentUserId: number;
  private currentFormId: number;
  private currentRankGroupId: number;
  private currentAvailableRankId: number;
  private currentAppraisalResultId: number;

  constructor() {
    this.users = new Map();
    this.forms = new Map();
    this.rankGroups = new Map();
    this.availableRanks = new Map();
    this.crewMembers = new Map();
    this.appraisalResults = new Map();
    this.currentUserId = 1;
    this.currentFormId = 1;
    this.currentRankGroupId = 1;
    this.currentAvailableRankId = 1;
    this.currentAppraisalResultId = 1;
  }

  // User methods
  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  // Form methods
  async getForms(): Promise<Form[]> {
    return Array.from(this.forms.values());
  }

  async getForm(id: number): Promise<Form | undefined> {
    return this.forms.get(id);
  }

  async createForm(form: InsertForm): Promise<Form> {
    const id = this.currentFormId++;
    const newForm: Form = { ...form, id };
    this.forms.set(id, newForm);
    return newForm;
  }

  async updateForm(id: number, form: Partial<InsertForm>): Promise<Form | undefined> {
    const existingForm = this.forms.get(id);
    if (!existingForm) return undefined;

    const updatedForm: Form = { ...existingForm, ...form };
    this.forms.set(id, updatedForm);
    return updatedForm;
  }

  async deleteForm(id: number): Promise<boolean> {
    return this.forms.delete(id);
  }

  // Rank Group methods
  async getRankGroups(formId: number): Promise<RankGroup[]> {
    return Array.from(this.rankGroups.values()).filter(rankGroup => rankGroup.formId === formId);
  }

  async createRankGroup(rankGroup: InsertRankGroup): Promise<RankGroup> {
    const id = this.currentRankGroupId++;
    const newRankGroup: RankGroup = { ...rankGroup, id };
    this.rankGroups.set(id, newRankGroup);
    return newRankGroup;
  }

  async updateRankGroup(id: number, rankGroupData: Partial<InsertRankGroup>): Promise<RankGroup | undefined> {
    const existingRankGroup = this.rankGroups.get(id);
    if (!existingRankGroup) return undefined;

    const updatedRankGroup: RankGroup = { ...existingRankGroup, ...rankGroupData };
    this.rankGroups.set(id, updatedRankGroup);
    return updatedRankGroup;
  }

  async deleteRankGroup(id: number): Promise<boolean> {
    return this.rankGroups.delete(id);
  }

  // Available Rank methods
  async getAvailableRanks(): Promise<AvailableRank[]> {
    return Array.from(this.availableRanks.values());
  }

  async createAvailableRank(rank: InsertAvailableRank): Promise<AvailableRank> {
    const id = this.currentAvailableRankId++;
    const availableRank: AvailableRank = { ...rank, id };
    this.availableRanks.set(id, availableRank);
    return availableRank;
  }

  // Crew Member methods
  async getCrewMembers(): Promise<CrewMember[]> {
    return Array.from(this.crewMembers.values());
  }

  async getCrewMember(id: string): Promise<CrewMember | undefined> {
    return this.crewMembers.get(id);
  }

  async createCrewMember(insertCrewMember: InsertCrewMember): Promise<CrewMember> {
    const crewMember: CrewMember = { ...insertCrewMember, createdAt: new Date(), updatedAt: new Date() };
    this.crewMembers.set(crewMember.id, crewMember);
    return crewMember;
  }

  async updateCrewMember(id: string, crewMemberData: Partial<InsertCrewMember>): Promise<CrewMember | undefined> {
    const existingCrewMember = this.crewMembers.get(id);
    if (!existingCrewMember) return undefined;

    const updatedCrewMember: CrewMember = { ...existingCrewMember, ...crewMemberData, updatedAt: new Date() };
    this.crewMembers.set(id, updatedCrewMember);
    return updatedCrewMember;
  }

  async deleteCrewMember(id: string): Promise<boolean> {
    return this.crewMembers.delete(id);
  }

  // Appraisal Result methods
  async getAppraisalResults(): Promise<AppraisalResult[]> {
    return Array.from(this.appraisalResults.values());
  }

  async getAppraisalResult(id: number): Promise<AppraisalResult | undefined> {
    return this.appraisalResults.get(id);
  }

  async createAppraisalResult(insertAppraisalResult: InsertAppraisalResult): Promise<AppraisalResult> {
    const id = this.currentAppraisalResultId++;
    const appraisalResult: AppraisalResult = { ...insertAppraisalResult, id };
    this.appraisalResults.set(id, appraisalResult);
    return appraisalResult;
  }

  async updateAppraisalResult(id: number, appraisalResultData: Partial<InsertAppraisalResult>): Promise<AppraisalResult | undefined> {
    const existingAppraisalResult = this.appraisalResults.get(id);
    if (!existingAppraisalResult) return undefined;

    const updatedAppraisalResult: AppraisalResult = { ...existingAppraisalResult, ...appraisalResultData };
    this.appraisalResults.set(id, updatedAppraisalResult);
    return updatedAppraisalResult;
  }

  async deleteAppraisalResult(id: number): Promise<boolean> {
    return this.appraisalResults.delete(id);
  }
}