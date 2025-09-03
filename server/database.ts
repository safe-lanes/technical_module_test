import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import {
  users,
  components,
  runningHoursAudit,
  spares,
  sparesHistory,
  storesLedger,
  changeRequest,
  changeRequestAttachment,
  changeRequestComment,
  type User,
  type InsertUser,
  type Component,
  type InsertComponent,
  type RunningHoursAudit,
  type InsertRunningHoursAudit,
  type Spare,
  type InsertSpare,
  type SpareHistory,
  type InsertSpareHistory,
  type StoresLedger,
  type InsertStoresLedger,
  type ChangeRequest,
  type InsertChangeRequest,
} from '@shared/schema';
import { eq } from 'drizzle-orm';
import { type IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private pool: mysql.Pool;

  constructor() {
    // Use MySQL environment variables
    const config = {
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      connectionLimit: 20,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
      idleTimeout: 300000,
      queueLimit: 0,
    };

    if (!config.host || !config.user || !config.password || !config.database) {
      throw new Error('MySQL connection environment variables are required: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE');
    }

    this.pool = mysql.createPool(config);
    this.db = drizzle(this.pool);
  }

  async close() {
    await this.pool.end();
  }

  async healthCheck(): Promise<boolean> {
    try {
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // Basic user operations for authentication
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values(insertUser).returning();
    return user;
  }

  // Components
  async getComponents(): Promise<Component[]> {
    return await this.db.select().from(components);
  }

  async getComponent(id: string): Promise<Component | undefined> {
    const [component] = await this.db.select().from(components).where(eq(components.id, id));
    return component || undefined;
  }

  async createComponent(insertComponent: InsertComponent): Promise<Component> {
    const [component] = await this.db.insert(components).values(insertComponent).returning();
    return component;
  }

  async updateComponent(id: string, updates: Partial<InsertComponent>): Promise<Component> {
    const [component] = await this.db
      .update(components)
      .set(updates)
      .where(eq(components.id, id))
      .returning();
    return component;
  }

  async deleteComponent(id: string): Promise<void> {
    await this.db.delete(components).where(eq(components.id, id));
  }

  // Running Hours
  async getRunningHoursAudit(): Promise<RunningHoursAudit[]> {
    return await this.db.select().from(runningHoursAudit);
  }

  async createRunningHoursAudit(insertAudit: InsertRunningHoursAudit): Promise<RunningHoursAudit> {
    const [audit] = await this.db.insert(runningHoursAudit).values(insertAudit).returning();
    return audit;
  }

  // Spares
  async getSpares(): Promise<Spare[]> {
    return await this.db.select().from(spares);
  }

  async getSpare(id: number): Promise<Spare | undefined> {
    const [spare] = await this.db.select().from(spares).where(eq(spares.id, id));
    return spare || undefined;
  }

  async createSpare(insertSpare: InsertSpare): Promise<Spare> {
    const [spare] = await this.db.insert(spares).values(insertSpare).returning();
    return spare;
  }

  async updateSpare(id: number, updates: Partial<InsertSpare>): Promise<Spare> {
    const [spare] = await this.db
      .update(spares)
      .set(updates)
      .where(eq(spares.id, id))
      .returning();
    return spare;
  }

  async deleteSpare(id: number): Promise<void> {
    await this.db.delete(spares).where(eq(spares.id, id));
  }

  // Spares History
  async getSparesHistory(): Promise<SpareHistory[]> {
    return await this.db.select().from(sparesHistory);
  }

  async createSpareHistory(insertHistory: InsertSpareHistory): Promise<SpareHistory> {
    const [history] = await this.db.insert(sparesHistory).values(insertHistory).returning();
    return history;
  }

  // Stores Ledger
  async getStoresLedger(): Promise<StoresLedger[]> {
    return await this.db.select().from(storesLedger);
  }

  async createStoresLedgerEntry(insertLedger: InsertStoresLedger): Promise<StoresLedger> {
    const [ledger] = await this.db.insert(storesLedger).values(insertLedger).returning();
    return ledger;
  }

  // Change Requests
  async getChangeRequests(): Promise<ChangeRequest[]> {
    return await this.db.select().from(changeRequest);
  }

  async getChangeRequest(id: number): Promise<ChangeRequest | undefined> {
    const [cr] = await this.db.select().from(changeRequest).where(eq(changeRequest.id, id));
    return cr || undefined;
  }

  async createChangeRequest(insertCR: InsertChangeRequest): Promise<ChangeRequest> {
    const [cr] = await this.db.insert(changeRequest).values(insertCR).returning();
    return cr;
  }

  async updateChangeRequest(id: number, updates: Partial<InsertChangeRequest>): Promise<ChangeRequest> {
    const [cr] = await this.db
      .update(changeRequest)
      .set(updates)
      .where(eq(changeRequest.id, id))
      .returning();
    return cr;
  }

  async deleteChangeRequest(id: number): Promise<void> {
    await this.db.delete(changeRequest).where(eq(changeRequest.id, id));
  }
}

// Export singleton instance
export const storage = new DatabaseStorage();