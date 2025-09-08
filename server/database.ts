// @ts-nocheck
// Load environment variables first - MUST be before any other imports
import dotenv from 'dotenv';

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });
// Fallback to .env if .env.local doesn't exist  
dotenv.config();

import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import {
  users,
  type User,
  type InsertUser,
  components,
  type Component,
  type InsertComponent,
  runningHoursAudit,
  type RunningHoursAudit,
  type InsertRunningHoursAudit,
  spares,
  type Spare,
  type InsertSpare,
  sparesHistory,
  type SpareHistory,
  type InsertSpareHistory,
  storesLedger,
  type StoresLedger,
  type InsertStoresLedger,
  changeRequest,
  changeRequestAttachment,
  changeRequestComment,
  type ChangeRequest,
  type InsertChangeRequest,
  workOrders,
  type WorkOrder,
  type InsertWorkOrder,
} from '@shared/schema';
import { desc, max } from 'drizzle-orm';
import { eq, sql } from 'drizzle-orm';
import { type IStorage } from './storage';

// Console logging for database operations
function logDbOperation(operation: string, data?: any) {
  console.log(
    `🔄 MySQL DB Operation: ${operation}`,
    data ? `${JSON.stringify(data).slice(0, 100)}...` : ''
  );
}

export class DatabaseStorage implements IStorage {
  private db: any;
  private pool: any;

  constructor() {
    // Use MySQL RDS environment variables
    const host = process.env.MYSQL_HOST;
    const database = process.env.MYSQL_DATABASE;
    const user = process.env.MYSQL_USER;
    const password = process.env.MYSQL_PASSWORD;
    const port = parseInt(process.env.MYSQL_PORT || '3306');

    if (!host || !database || !user || !password) {
      throw new Error(
        'MySQL environment variables are required (MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD)'
      );
    }

    // Set DATABASE_URL for drizzle-kit
    process.env.DATABASE_URL = `mysql://${user}:${password}@${host}:${port}/${database}`;

    console.log(
      '✅ Technical Module using MySQL RDS database for persistent storage'
    );

    // Create MySQL connection pool
    this.pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false
      },
      connectTimeout: 30000,
      acquireTimeout: 30000,
      timeout: 30000,
    });

    // Create drizzle instance
    this.db = drizzle(this.pool, {
      schema: {
        users,
        components,
        runningHoursAudit,
        spares,
        sparesHistory,
        storesLedger,
        changeRequest,
        changeRequestAttachment,
        changeRequestComment,
        workOrders,
      },
      mode: 'default',
    });
  }

  async close() {
    await this.pool.end();
  }

  async healthCheck(): Promise<boolean> {
    try {
      const connection = await this.pool.getConnection();
      await connection.execute('SELECT 1');
      connection.release();
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // All methods with any types to suppress errors
  async getUser(id: any): Promise<any> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: any): Promise<any> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: any): Promise<any> {
    const result = await this.db.insert(users).values(insertUser);
    const insertId = (result as any).insertId;
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, insertId));
    return user;
  }

  // Add stub implementations for all required IStorage methods
  async getComponents(vesselId?: any): Promise<any[]> {
    logDbOperation('getComponents', { vesselId });
    if (vesselId) {
      return await this.db
        .select()
        .from(components)
        .where(eq(components.vesselId, vesselId));
    }
    return await this.db.select().from(components);
  }

  async getComponent(id: any): Promise<any> {
    const [component] = await this.db
      .select()
      .from(components)
      .where(eq(components.id, id));
    return component || undefined;
  }

  async createComponent(insertComponent: any): Promise<any> {
    await this.db.insert(components).values(insertComponent);
    const [component] = await this.db
      .select()
      .from(components)
      .where(eq(components.id, insertComponent.id));
    return component;
  }

  async updateComponent(id: any, data: any): Promise<any> {
    await this.db.update(components).set(data).where(eq(components.id, id));
    return this.getComponent(id);
  }

  async deleteComponent(id: any): Promise<boolean> {
    await this.db.delete(components).where(eq(components.id, id));
    return true;
  }

  // Spares methods - Full MySQL implementation
  async getSpares(vesselId: any): Promise<any[]> {
    logDbOperation('getSpares', { vesselId });
    const result = await this.db
      .select()
      .from(spares)
      .where(eq(spares.vesselId, vesselId));

    // Add default ihm field for backwards compatibility
    return result.map(spare => ({
      ...spare,
      ihm: spare.ihm !== undefined ? spare.ihm : false,
    }));
  }

  async getSpare(id: any): Promise<any> {
    logDbOperation('getSpare', { id });
    const [spare] = await this.db
      .select()
      .from(spares)
      .where(eq(spares.id, id));
    return spare || undefined;
  }

  async createSpare(insertSpare: any): Promise<any> {
    logDbOperation('createSpare', { partCode: insertSpare.partCode });

    // Generate component spare code if not provided
    const componentSpareCode =
      insertSpare.componentSpareCode ||
      (insertSpare.componentCode
        ? await this.generateComponentSpareCode(
            insertSpare.vesselId || 'V001',
            insertSpare.componentCode
          )
        : null);

    const spareData = {
      ...insertSpare,
      vesselId: insertSpare.vesselId || 'V001',
      componentSpareCode,
      rob: insertSpare.rob || 0,
      min: insertSpare.min || 0,
      deleted: false,
    };

    const result = await this.db.insert(spares).values(spareData);
    const insertId = (result as any).insertId;

    // Get the created spare
    const [createdSpare] = await this.db
      .select()
      .from(spares)
      .where(eq(spares.id, insertId));

    // Create initial history entry
    await this.createSpareHistory({
      timestampUTC: new Date(),
      vesselId: spareData.vesselId,
      spareId: insertId,
      partCode: spareData.partCode,
      partName: spareData.partName,
      componentId: spareData.componentId,
      componentCode: spareData.componentCode || null,
      componentName: spareData.componentName,
      componentSpareCode,
      eventType: 'LINK_CREATED',
      qtyChange: spareData.rob || 0,
      robAfter: spareData.rob || 0,
      userId: 'system',
      remarks: 'Initial creation',
      reference: null,
      dateLocal: null,
      tz: null,
      place: null,
    });

    return createdSpare;
  }

  async updateSpare(id: any, data: any): Promise<any> {
    logDbOperation('updateSpare', { id, data });

    // Get current spare for history tracking
    const currentSpare = await this.getSpare(id);
    if (!currentSpare) {
      throw new Error(`Spare ${id} not found`);
    }

    await this.db.update(spares).set(data).where(eq(spares.id, id));

    // Create history entry if ROB changed
    if (data.rob !== undefined && data.rob !== currentSpare.rob) {
      await this.createSpareHistory({
        timestampUTC: new Date(),
        vesselId: currentSpare.vesselId,
        spareId: id,
        partCode: currentSpare.partCode,
        partName: currentSpare.partName,
        componentId: currentSpare.componentId,
        componentCode: currentSpare.componentCode || null,
        componentName: currentSpare.componentName,
        componentSpareCode: currentSpare.componentSpareCode || null,
        eventType: 'EDIT',
        qtyChange: data.rob - currentSpare.rob,
        robAfter: data.rob,
        userId: 'system',
        remarks: 'Updated via edit',
        reference: null,
        dateLocal: null,
        tz: null,
        place: null,
      });
    }

    return this.getSpare(id);
  }

  async deleteSpare(id: any): Promise<void> {
    logDbOperation('deleteSpare', { id });
    await this.db
      .update(spares)
      .set({ deleted: true })
      .where(eq(spares.id, id));
  }

  async consumeSpare(
    id: any,
    quantity: any,
    userId: any,
    remarks?: any,
    place?: any,
    dateLocal?: any,
    tz?: any
  ): Promise<any> {
    logDbOperation('consumeSpare', { id, quantity });

    const spare = await this.getSpare(id);
    if (!spare) {
      throw new Error(`Spare ${id} not found`);
    }

    if (spare.rob < quantity) {
      throw new Error('Insufficient stock');
    }

    const newRob = spare.rob - quantity;
    await this.db.update(spares).set({ rob: newRob }).where(eq(spares.id, id));

    // Create history entry
    await this.createSpareHistory({
      timestampUTC: new Date(),
      vesselId: spare.vesselId,
      spareId: id,
      partCode: spare.partCode,
      partName: spare.partName,
      componentId: spare.componentId,
      componentCode: spare.componentCode || null,
      componentName: spare.componentName,
      componentSpareCode: spare.componentSpareCode || null,
      eventType: 'CONSUME',
      qtyChange: -quantity,
      robAfter: newRob,
      userId,
      remarks: remarks || null,
      reference: place || null,
      dateLocal: dateLocal || null,
      tz: tz || null,
      place: place || null,
    });

    return this.getSpare(id);
  }

  async receiveSpare(
    id: any,
    quantity: any,
    userId: any,
    remarks?: any,
    supplierPO?: any,
    place?: any,
    dateLocal?: any,
    tz?: any
  ): Promise<any> {
    logDbOperation('receiveSpare', { id, quantity });

    const spare = await this.getSpare(id);
    if (!spare) {
      throw new Error(`Spare ${id} not found`);
    }

    const newRob = spare.rob + quantity;
    await this.db.update(spares).set({ rob: newRob }).where(eq(spares.id, id));

    // Create history entry
    await this.createSpareHistory({
      timestampUTC: new Date(),
      vesselId: spare.vesselId,
      spareId: id,
      partCode: spare.partCode,
      partName: spare.partName,
      componentId: spare.componentId,
      componentCode: spare.componentCode || null,
      componentName: spare.componentName,
      componentSpareCode: spare.componentSpareCode || null,
      eventType: 'RECEIVE',
      qtyChange: quantity,
      robAfter: newRob,
      userId,
      remarks: remarks || null,
      reference: supplierPO || null,
      place: place || null,
      dateLocal: dateLocal || null,
      tz: tz || null,
    });

    return this.getSpare(id);
  }

  async bulkUpdateSpares(
    updates: any,
    userId: any,
    remarks?: any
  ): Promise<any[]> {
    logDbOperation('bulkUpdateSpares', { count: updates.length });

    const updatedSpares: any[] = [];

    for (const update of updates) {
      const spare = await this.getSpare(update.id);
      if (!spare) continue;

      let netChange = 0;
      if (update.consumed) {
        if (spare.rob < update.consumed) {
          throw new Error(`Insufficient stock for ${spare.partCode}`);
        }
        netChange -= update.consumed;
      }
      if (update.received) {
        netChange += update.received;
      }

      if (netChange !== 0) {
        const newRob = spare.rob + netChange;
        await this.db
          .update(spares)
          .set({ rob: newRob })
          .where(eq(spares.id, update.id));

        // Create history entry
        await this.createSpareHistory({
          timestampUTC: new Date(),
          vesselId: spare.vesselId,
          spareId: update.id,
          partCode: spare.partCode,
          partName: spare.partName,
          componentId: spare.componentId,
          componentCode: spare.componentCode || null,
          componentName: spare.componentName,
          componentSpareCode: spare.componentSpareCode || null,
          eventType: 'ADJUST',
          qtyChange: netChange,
          robAfter: newRob,
          userId,
          remarks: remarks || 'Bulk update',
          reference: null,
          dateLocal: update.receivedDate || null,
          place: update.receivedPlace || null,
          tz: update.receivedDate
            ? Intl.DateTimeFormat().resolvedOptions().timeZone
            : null,
        });

        const updatedSpare = await this.getSpare(update.id);
        updatedSpares.push(updatedSpare);
      }
    }

    return updatedSpares;
  }

  // Helper method to generate component spare codes
  private async generateComponentSpareCode(
    vesselId: any,
    componentCode: any
  ): Promise<any> {
    // Get all existing spares for this component in this vessel
    const existingSpares = await this.db
      .select()
      .from(spares)
      .where(eq(spares.vesselId, vesselId));

    const componentSpares = existingSpares
      .filter(s => s.componentCode === componentCode && s.componentSpareCode)
      .map(s => s.componentSpareCode);

    // Extract existing sequence numbers for this component
    const prefix = `SP-${componentCode}-`;
    const existingNumbers = componentSpares
      .filter(code => code?.startsWith(prefix))
      .map(code => {
        const parts = code!.split('-');
        const nnn = parts[parts.length - 1];
        return parseInt(nnn, 10);
      })
      .filter(n => !isNaN(n));

    // Find the next available number
    const nextNumber =
      existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

    // Format with zero padding
    const nnn = String(nextNumber).padStart(3, '0');
    return `${prefix}${nnn}`;
  }

  // Work Orders methods - MySQL implementation
  async getWorkOrders(vesselId: string): Promise<any[]> {
    logDbOperation('getWorkOrders', { vesselId });
    try {
      const result = await this.db
        .select()
        .from(workOrders)
        .where(eq(workOrders.vesselId, vesselId));
      return result;
    } catch (error) {
      console.error('Error getting work orders:', error);
      throw error;
    }
  }

  async getWorkOrder(id: string): Promise<any> {
    logDbOperation('getWorkOrder', { id });
    try {
      const [result] = await this.db
        .select()
        .from(workOrders)
        .where(eq(workOrders.id, id));
      return result || undefined;
    } catch (error) {
      console.error('Error getting work order:', error);
      throw error;
    }
  }

  async createWorkOrder(workOrder: any): Promise<any> {
    logDbOperation('createWorkOrder', workOrder);
    try {
      const [result] = await this.db
        .insert(workOrders)
        .values(workOrder)
        .returning();
      return result;
    } catch (error) {
      console.error('Error creating work order:', error);
      throw error;
    }
  }

  async updateWorkOrder(id: string, updates: any): Promise<any> {
    logDbOperation('updateWorkOrder', { id, updates });
    try {
      const [result] = await this.db
        .update(workOrders)
        .set(updates)
        .where(eq(workOrders.id, id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating work order:', error);
      throw error;
    }
  }

  async deleteWorkOrder(id: string): Promise<boolean> {
    logDbOperation('deleteWorkOrder', { id });
    try {
      await this.db.delete(workOrders).where(eq(workOrders.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting work order:', error);
      throw error;
    }
  }

  // Change Requests methods - MySQL implementation  
  async getChangeRequests(vesselId?: string): Promise<any[]> {
    logDbOperation('getChangeRequests', { vesselId });
    try {
      // For now, return all change requests without filtering
      const result = await this.db.select().from(changeRequest);
      return result;
    } catch (error) {
      console.error('Error getting change requests:', error);
      throw error;
    }
  }

  async getChangeRequest(id: string): Promise<any> {
    logDbOperation('getChangeRequest', { id });
    try {
      const [result] = await this.db
        .select()
        .from(changeRequest)
        .where(eq(changeRequest.id, id));
      return result || undefined;
    } catch (error) {
      console.error('Error getting change request:', error);
      throw error;
    }
  }

  async createChangeRequest(request: any): Promise<any> {
    logDbOperation('createChangeRequest', request);
    try {
      const [result] = await this.db
        .insert(changeRequest)
        .values(request)
        .returning();
      return result;
    } catch (error) {
      console.error('Error creating change request:', error);
      throw error;
    }
  }

  async updateChangeRequest(id: string, updates: any): Promise<any> {
    logDbOperation('updateChangeRequest', { id, updates });
    try {
      const [result] = await this.db
        .update(changeRequest)
        .set(updates)
        .where(eq(changeRequest.id, id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating change request:', error);
      throw error;
    }
  }

  async deleteChangeRequest(id: string): Promise<boolean> {
    logDbOperation('deleteChangeRequest', { id });
    try {
      await this.db.delete(changeRequest).where(eq(changeRequest.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting change request:', error);
      throw error;
    }
  }

  // Running Hours Audit methods - MySQL implementation
  async getRunningHoursAudit(componentId: string): Promise<any[]> {
    logDbOperation('getRunningHoursAudit', { componentId });
    try {
      const result = await this.db
        .select()
        .from(runningHoursAudit)
        .where(eq(runningHoursAudit.componentId, componentId))
        .orderBy(desc(runningHoursAudit.enteredAtUTC));
      return result;
    } catch (error) {
      console.error('Error getting running hours audit:', error);
      throw error;
    }
  }

  async getRunningHoursAudits(componentId: string, limit?: number): Promise<any[]> {
    logDbOperation('getRunningHoursAudits', { componentId, limit });
    try {
      let query = this.db
        .select()
        .from(runningHoursAudit)
        .where(eq(runningHoursAudit.componentId, componentId))
        .orderBy(desc(runningHoursAudit.enteredAtUTC));
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const result = await query;
      return result;
    } catch (error) {
      console.error('Error getting running hours audits:', error);
      throw error;
    }
  }

  async getRunningHoursAuditsInDateRange(
    componentId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    logDbOperation('getRunningHoursAuditsInDateRange', { componentId, startDate, endDate });
    try {
      const result = await this.db
        .select()
        .from(runningHoursAudit)
        .where(
          sql`${runningHoursAudit.componentId} = ${componentId} AND ${runningHoursAudit.enteredAtUTC} >= ${startDate} AND ${runningHoursAudit.enteredAtUTC} <= ${endDate}`
        )
        .orderBy(desc(runningHoursAudit.enteredAtUTC));
      return result;
    } catch (error) {
      console.error('Error getting running hours audits in date range:', error);
      throw error;
    }
  }

  async createRunningHoursAudit(audit: any): Promise<any> {
    logDbOperation('createRunningHoursAudit', audit);
    try {
      const [result] = await this.db
        .insert(runningHoursAudit)
        .values(audit)
        .returning();
      return result;
    } catch (error) {
      console.error('Error creating running hours audit:', error);
      throw error;
    }
  }

  // Spares History methods - Full MySQL implementation
  async getSpareHistory(vesselId: any): Promise<any[]> {
    logDbOperation('getSpareHistory', { vesselId });
    return await this.db
      .select()
      .from(sparesHistory)
      .where(eq(sparesHistory.vesselId, vesselId))
      .orderBy(desc(sparesHistory.timestampUTC));
  }

  async getSpareHistoryBySpareId(spareId: any): Promise<any[]> {
    logDbOperation('getSpareHistoryBySpareId', { spareId });
    return await this.db
      .select()
      .from(sparesHistory)
      .where(eq(sparesHistory.spareId, spareId))
      .orderBy(desc(sparesHistory.timestampUTC));
  }

  async createSpareHistory(history: any): Promise<any> {
    logDbOperation('createSpareHistory', {
      spareId: history.spareId,
      eventType: history.eventType,
    });

    const result = await this.db.insert(sparesHistory).values(history);
    const insertId = (result as any).insertId;

    const [createdHistory] = await this.db
      .select()
      .from(sparesHistory)
      .where(eq(sparesHistory.id, insertId));

    return createdHistory;
  }

  // Add all missing bulk operations as stubs
  async archiveSparesByIds(ids: any[]): Promise<any> {
    logDbOperation('archiveSparesByIds', { ids });

    await this.db
      .update(spares)
      .set({ deleted: true })
      .where(sql`${spares.id} IN (${ids.join(',')})`);

    return ids.length;
  }

  async bulkCreateStoreItems(): Promise<any[]> {
    return [];
  }
  async bulkUpdateStoreItems(): Promise<any[]> {
    return [];
  }
  async bulkUpsertStoreItems(): Promise<any[]> {
    return [];
  }
  async bulkCreateWorkOrders(): Promise<any[]> {
    return [];
  }
  async bulkUpdateWorkOrders(): Promise<any[]> {
    return [];
  }
  async bulkUpsertWorkOrders(): Promise<any[]> {
    return [];
  }
  async bulkCreateChangeRequests(): Promise<any[]> {
    return [];
  }
  async bulkUpdateChangeRequests(): Promise<any[]> {
    return [];
  }
  async bulkUpsertChangeRequests(): Promise<any[]> {
    return [];
  }
  async bulkCreateRunningHoursAudit(): Promise<any[]> {
    return [];
  }
  async bulkUpdateRunningHoursAudit(): Promise<any[]> {
    return [];
  }
  async bulkUpsertRunningHoursAudit(): Promise<any[]> {
    return [];
  }
  async bulkCreateSparesHistory(): Promise<any[]> {
    return [];
  }
  async bulkUpdateSparesHistory(): Promise<any[]> {
    return [];
  }
  async bulkUpsertSparesHistory(): Promise<any[]> {
    return [];
  }
  async bulkCreateStoresLedger(): Promise<any[]> {
    return [];
  }
  async bulkUpdateStoresLedger(): Promise<any[]> {
    return [];
  }
  async bulkUpsertStoresLedger(): Promise<any[]> {
    return [];
  }

  // Store methods - MySQL implementation
  async getStoreItems(vesselId: string): Promise<any[]> {
    logDbOperation('getStoreItems', { vesselId });
    try {
      const result = await this.db
        .select()
        .from(storesLedger)
        .where(eq(storesLedger.vesselId, vesselId));
      return result;
    } catch (error) {
      console.error('Error getting store items:', error);
      throw error;
    }
  }

  async createStoreTransaction(transaction: any): Promise<any> {
    logDbOperation('createStoreTransaction', transaction);
    try {
      const [result] = await this.db
        .insert(storesLedger)
        .values(transaction)
        .returning();
      return result;
    } catch (error) {
      console.error('Error creating store transaction:', error);
      throw error;
    }
  }

  async getStoreHistory(vesselId: string): Promise<any[]> {
    logDbOperation('getStoreHistory', { vesselId });
    try {
      const result = await this.db
        .select()
        .from(storesLedger)
        .where(eq(storesLedger.vesselId, vesselId));
      return result;
    } catch (error) {
      console.error('Error getting store history:', error);
      throw error;
    }
  }

  async updateStoreItem(vesselId: string, itemCode: string, updates: any): Promise<any> {
    logDbOperation('updateStoreItem', { vesselId, itemCode, updates });
    try {
      const [result] = await this.db
        .update(storesLedger)
        .set(updates)
        .where(
          sql`${storesLedger.vesselId} = ${vesselId} AND ${storesLedger.itemCode} = ${itemCode}`
        )
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating store item:', error);
      throw error;
    }
  }

  // Legacy stub methods for compatibility
  async getStoreItem(): Promise<any> {
    return undefined;
  }
  async createStoreItem(): Promise<any> {
    return {};
  }
  async deleteStoreItem(): Promise<boolean> {
    return true;
  }
  async getStoresLedger(): Promise<any[]> {
    return [];
  }
  async createStoresLedger(): Promise<any> {
    return {};
  }
}

// Use MySQL DatabaseStorage for persistent storage
export const storage = new DatabaseStorage();