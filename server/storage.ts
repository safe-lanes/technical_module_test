
import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  // Technical Module specific methods will be added here as needed
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private currentUserId: number;

  constructor() {
    this.users = new Map();
    this.currentUserId = 1;
    // Technical Module data initialization will be added here as needed
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

  // Technical Module methods will be added here as needed
}

// Use in-memory storage for Technical Module
const storage: IStorage = new MemStorage();
console.log("ℹ️  Technical Module using in-memory storage for development");

export { storage };
