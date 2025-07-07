import { users, type User, type InsertUser, type Form, type InsertForm } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private forms: Map<number, Form>;
  private currentUserId: number;
  private currentFormId: number;

  constructor() {
    this.users = new Map();
    this.forms = new Map();
    this.currentUserId = 1;
    this.currentFormId = 1;
    
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
}

export const storage = new MemStorage();
