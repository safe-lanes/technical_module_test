import { users, type User, type InsertUser, type Form, type InsertForm, type RankGroup, type InsertRankGroup, type AvailableRank, type InsertAvailableRank } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private forms: Map<number, Form>;
  private rankGroups: Map<number, RankGroup>;
  private availableRanks: Map<number, AvailableRank>;
  private currentUserId: number;
  private currentFormId: number;
  private currentRankGroupId: number;
  private currentAvailableRankId: number;

  constructor() {
    this.users = new Map();
    this.forms = new Map();
    this.rankGroups = new Map();
    this.availableRanks = new Map();
    this.currentUserId = 1;
    this.currentFormId = 1;
    this.currentRankGroupId = 1;
    this.currentAvailableRankId = 1;
    
    // Initialize with sample form data - multiple rank groups for same form
    this.forms.set(1, {
      id: 1,
      name: "Crew Appraisal Form",
      rankGroup: "Senior Officers",
      versionNo: "01",
      versionDate: "01-Jan-2025",
    });
    this.forms.set(2, {
      id: 2,
      name: "Crew Appraisal Form",
      rankGroup: "Junior Officers",
      versionNo: "01",
      versionDate: "01-Jan-2025",
    });
    this.forms.set(3, {
      id: 3,
      name: "Crew Appraisal Form",
      rankGroup: "Ratings",
      versionNo: "01",
      versionDate: "01-Jan-2025",
    });
    this.currentFormId = 4;
    
    // Initialize with sample available ranks
    this.availableRanks.set(1, { id: 1, name: "Master", category: "Senior Officers" });
    this.availableRanks.set(2, { id: 2, name: "Chief Officer", category: "Senior Officers" });
    this.availableRanks.set(3, { id: 3, name: "Chief Engineer", category: "Senior Officers" });
    this.availableRanks.set(4, { id: 4, name: "2nd Officer", category: "Junior Officers" });
    this.availableRanks.set(5, { id: 5, name: "3rd Officer", category: "Junior Officers" });
    this.availableRanks.set(6, { id: 6, name: "2nd Engineer", category: "Junior Officers" });
    this.availableRanks.set(7, { id: 7, name: "3rd Engineer", category: "Junior Officers" });
    this.availableRanks.set(8, { id: 8, name: "Bosun", category: "Ratings" });
    this.availableRanks.set(9, { id: 9, name: "AB", category: "Ratings" });
    this.availableRanks.set(10, { id: 10, name: "OS", category: "Ratings" });
    this.availableRanks.set(11, { id: 11, name: "Oiler", category: "Ratings" });
    this.availableRanks.set(12, { id: 12, name: "Wiper", category: "Ratings" });
    this.currentAvailableRankId = 13;
    
    // Initialize with sample rank groups
    this.rankGroups.set(1, {
      id: 1,
      formId: 1,
      name: "Senior Officers",
      ranks: ["Master", "Chief Officer", "Chief Engineer"]
    });
    this.rankGroups.set(2, {
      id: 2,
      formId: 1,
      name: "Junior Officers", 
      ranks: ["2nd Officer", "3rd Officer", "2nd Engineer", "3rd Engineer"]
    });
    this.rankGroups.set(3, {
      id: 3,
      formId: 1,
      name: "Ratings",
      ranks: ["Bosun", "AB", "OS", "Oiler", "Wiper"]
    });
    this.currentRankGroupId = 4;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getForms(): Promise<Form[]> {
    return Array.from(this.forms.values());
  }

  async getForm(id: number): Promise<Form | undefined> {
    return this.forms.get(id);
  }

  async createForm(insertForm: InsertForm): Promise<Form> {
    const id = this.currentFormId++;
    const form: Form = { ...insertForm, id };
    this.forms.set(id, form);
    return form;
  }

  async updateForm(id: number, formData: Partial<InsertForm>): Promise<Form | undefined> {
    const existingForm = this.forms.get(id);
    if (!existingForm) return undefined;
    
    const updatedForm: Form = { ...existingForm, ...formData };
    this.forms.set(id, updatedForm);
    return updatedForm;
  }

  async deleteForm(id: number): Promise<boolean> {
    return this.forms.delete(id);
  }

  async getRankGroups(formId: number): Promise<RankGroup[]> {
    return Array.from(this.rankGroups.values()).filter(rg => rg.formId === formId);
  }

  async createRankGroup(insertRankGroup: InsertRankGroup): Promise<RankGroup> {
    const id = this.currentRankGroupId++;
    const rankGroup: RankGroup = { ...insertRankGroup, id };
    this.rankGroups.set(id, rankGroup);
    return rankGroup;
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

  async getAvailableRanks(): Promise<AvailableRank[]> {
    return Array.from(this.availableRanks.values());
  }

  async createAvailableRank(insertAvailableRank: InsertAvailableRank): Promise<AvailableRank> {
    const id = this.currentAvailableRankId++;
    const availableRank: AvailableRank = { ...insertAvailableRank, id };
    this.availableRanks.set(id, availableRank);
    return availableRank;
  }
}

export const storage = new MemStorage();
