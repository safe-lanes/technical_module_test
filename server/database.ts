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
  workOrders,
  type WorkOrder,
  type InsertWorkOrder,
} from '@shared/schema';
import { desc, max } from 'drizzle-orm';
import { eq, sql } from 'drizzle-orm';
import { type IStorage } from './storage';

// Console logging for database operations
function logDbOperation(operation: string, data?: any) {
  console.log(`🔄 MySQL DB Operation: ${operation}`, data ? JSON.stringify(data).slice(0, 100) + '...' : '');
}

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private pool: mysql.Pool;

  constructor() {
    // Use MySQL RDS environment variables
    const host = process.env.MYSQL_HOST;
    const database = process.env.MYSQL_DATABASE;
    const user = process.env.MYSQL_USER;
    const password = process.env.MYSQL_PASSWORD;
    const port = parseInt(process.env.MYSQL_PORT || '3306');
    
    if (!host || !database || !user || !password) {
      throw new Error('MySQL environment variables are required (MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD)');
    }

    console.log('✅ Technical Module using MySQL RDS database for persistent storage');

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
      acquireTimeout: 60000,
      timeout: 60000,
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
    const result = await this.db.insert(users).values(insertUser);
    const insertId = result.insertId;
    const [user] = await this.db.select().from(users).where(eq(users.id, insertId));
    return user;
  }

  // Components
  async getComponents(vesselId?: string): Promise<Component[]> {
    logDbOperation('getComponents', { vesselId });
    if (vesselId) {
      return await this.db.select().from(components).where(eq(components.vesselId, vesselId));
    }
    return await this.db.select().from(components);
  }

  async getComponent(id: string): Promise<Component | undefined> {
    const [component] = await this.db.select().from(components).where(eq(components.id, id));
    return component || undefined;
  }

  async createComponent(insertComponent: InsertComponent): Promise<Component> {
    await this.db.insert(components).values(insertComponent);
    const [component] = await this.db.select().from(components).where(eq(components.id, insertComponent.id));
    return component;
  }

  async updateComponent(id: string, updates: Partial<InsertComponent>): Promise<Component> {
    await this.db
      .update(components)
      .set(updates)
      .where(eq(components.id, id));
    const [component] = await this.db.select().from(components).where(eq(components.id, id));
    return component;
  }

  async deleteComponent(id: string): Promise<void> {
    await this.db.delete(components).where(eq(components.id, id));
  }

  // Running Hours
  async getRunningHoursAudit(): Promise<RunningHoursAudit[]> {
    return await this.db.select().from(runningHoursAudit);
  }

  async getRunningHoursAudits(componentId: string, limit?: number): Promise<RunningHoursAudit[]> {
    let query = this.db.select().from(runningHoursAudit).where(eq(runningHoursAudit.componentId, componentId));
    if (limit) {
      query = query.limit(limit);
    }
    return await query;
  }

  async getRunningHoursAuditsInDateRange(componentId: string, startDate: Date, endDate: Date): Promise<RunningHoursAudit[]> {
    return await this.db.select().from(runningHoursAudit)
      .where(eq(runningHoursAudit.componentId, componentId))
      .where(sql`${runningHoursAudit.enteredAtUTC} >= ${startDate}`)
      .where(sql`${runningHoursAudit.enteredAtUTC} <= ${endDate}`);
  }

  async createRunningHoursAudit(insertAudit: InsertRunningHoursAudit): Promise<RunningHoursAudit> {
    const result = await this.db.insert(runningHoursAudit).values(insertAudit);
    const insertId = result.insertId;
    const [audit] = await this.db.select().from(runningHoursAudit).where(eq(runningHoursAudit.id, insertId));
    return audit;
  }

  // Spares
  async getSpares(vesselId?: string): Promise<Spare[]> {
    logDbOperation('getSpares', { vesselId });
    if (vesselId) {
      return await this.db.select().from(spares).where(eq(spares.vesselId, vesselId));
    }
    return await this.db.select().from(spares);
  }

  async getSpare(id: number): Promise<Spare | undefined> {
    const [spare] = await this.db.select().from(spares).where(eq(spares.id, id));
    return spare || undefined;
  }

  async createSpare(insertSpare: InsertSpare): Promise<Spare> {
    logDbOperation('createSpare', insertSpare);
    const result = await this.db.insert(spares).values(insertSpare);
    const insertId = result.insertId;
    const [spare] = await this.db.select().from(spares).where(eq(spares.id, insertId));
    return spare;
  }

  async updateSpare(id: number, updates: Partial<InsertSpare>): Promise<Spare> {
    logDbOperation('updateSpare', { id, updates });
    await this.db
      .update(spares)
      .set(updates)
      .where(eq(spares.id, id));
    const [spare] = await this.db.select().from(spares).where(eq(spares.id, id));
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
    const result = await this.db.insert(sparesHistory).values(insertHistory);
    const insertId = result.insertId;
    const [history] = await this.db.select().from(sparesHistory).where(eq(sparesHistory.id, insertId));
    return history;
  }

  // Stores Ledger
  async getStoresLedger(): Promise<StoresLedger[]> {
    return await this.db.select().from(storesLedger);
  }

  async createStoresLedgerEntry(insertLedger: InsertStoresLedger): Promise<StoresLedger> {
    const result = await this.db.insert(storesLedger).values(insertLedger);
    const insertId = result.insertId;
    const [ledger] = await this.db.select().from(storesLedger).where(eq(storesLedger.id, insertId));
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
    const result = await this.db.insert(changeRequest).values(insertCR);
    const insertId = result.insertId;
    const [cr] = await this.db.select().from(changeRequest).where(eq(changeRequest.id, insertId));
    return cr;
  }

  async updateChangeRequest(id: number, updates: Partial<InsertChangeRequest>): Promise<ChangeRequest> {
    await this.db
      .update(changeRequest)
      .set(updates)
      .where(eq(changeRequest.id, id));
    const [cr] = await this.db.select().from(changeRequest).where(eq(changeRequest.id, id));
    return cr;
  }

  async deleteChangeRequest(id: number): Promise<void> {
    await this.db.delete(changeRequest).where(eq(changeRequest.id, id));
  }

  // Additional methods required by IStorage
  async consumeSpare(
    id: number,
    quantity: number,
    userId: string,
    remarks?: string,
    place?: string,
    dateLocal?: string,
    tz?: string
  ): Promise<Spare> {
    // Get current spare
    const spare = await this.getSpare(id);
    if (!spare) throw new Error('Spare not found');

    // Update ROB
    const newRob = spare.rob - quantity;
    const updatedSpare = await this.updateSpare(id, { rob: newRob });

    // Create history entry
    await this.createSpareHistory({
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
      userId,
      remarks: remarks || null,
      reference: null,
      dateLocal: dateLocal || null,
      tz: tz || null,
      place: place || null,
    });

    return updatedSpare;
  }

  async receiveSpare(
    id: number,
    quantity: number,
    userId: string,
    remarks?: string,
    supplierPO?: string,
    place?: string,
    dateLocal?: string,
    tz?: string
  ): Promise<Spare> {
    // Get current spare
    const spare = await this.getSpare(id);
    if (!spare) throw new Error('Spare not found');

    // Update ROB
    const newRob = spare.rob + quantity;
    const updatedSpare = await this.updateSpare(id, { rob: newRob });

    // Create history entry
    await this.createSpareHistory({
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
      userId,
      remarks: remarks || null,
      reference: supplierPO || null,
      dateLocal: dateLocal || null,
      tz: tz || null,
      place: place || null,
    });

    return updatedSpare;
  }

  async bulkUpdateSpares(
    updates: Array<{
      id: number;
      consumed?: number;
      received?: number;
      receivedDate?: string;
      receivedPlace?: string;
    }>,
    userId: string,
    remarks?: string
  ): Promise<Spare[]> {
    const results: Spare[] = [];
    
    for (const update of updates) {
      if (update.consumed) {
        const result = await this.consumeSpare(
          update.id,
          update.consumed,
          userId,
          remarks
        );
        results.push(result);
      }
      
      if (update.received) {
        const result = await this.receiveSpare(
          update.id,
          update.received,
          userId,
          remarks,
          undefined,
          update.receivedPlace,
          update.receivedDate
        );
        results.push(result);
      }
    }
    
    return results;
  }

  async getSpareHistory(vesselId: string): Promise<SpareHistory[]> {
    return await this.db.select().from(sparesHistory).where(eq(sparesHistory.vesselId, vesselId));
  }

  async getSpareHistoryBySpareId(spareId: number): Promise<SpareHistory[]> {
    return await this.db.select().from(sparesHistory).where(eq(sparesHistory.spareId, spareId));
  }

  // Store Ledger methods
  async getStoreItems(vesselId: string): Promise<any[]> {
    logDbOperation('getStoreItems', { vesselId });
    
    try {
      // Get all transactions for this vessel
      const allTransactions = await this.db.select()
        .from(storesLedger)
        .where(eq(storesLedger.vesselId, vesselId))
        .orderBy(desc(storesLedger.timestampUTC));

      // Group by item code to get latest info
      const itemsMap = new Map();
      
      for (const transaction of allTransactions) {
        const itemCode = transaction.itemCode;
        
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
            notes: ''
          });
        }

        // Update with latest catalog info if this is a CATALOG_UPDATE
        if (transaction.eventType === 'CATALOG_UPDATE' && transaction.remarks) {
          try {
            const catalogInfo = JSON.parse(transaction.remarks);
            const item = itemsMap.get(itemCode);
            item.min_stock = catalogInfo.minStock || 1;
            item.notes = catalogInfo.notes || '';
            item.location = catalogInfo.location || item.location;
          } catch (e) {
            // Ignore invalid JSON
          }
        }
      }

      // Convert map to array and calculate stock status
      const result = Array.from(itemsMap.values()).map(item => ({
        ...item,
        stock: item.rob <= item.min_stock ? 'Minimum' : 
               item.rob <= (item.min_stock * 1.5) ? 'Low' : 'OK'
      }));
      
      return result;
    } catch (error) {
      console.error('Error fetching store items:', error);
      return [];
    }
  }

  async createStoreTransaction(transaction: any): Promise<any> {
    logDbOperation('createStoreTransaction', transaction);
    await this.db.insert(storesLedger).values(transaction);
    return transaction; // MySQL doesn't support returning, so return the original transaction
  }

  async getStoreHistory(vesselId: string): Promise<any[]> {
    logDbOperation('getStoreHistory', { vesselId });
    return await this.db.select().from(storesLedger)
      .where(eq(storesLedger.vesselId, vesselId))
      .orderBy(desc(storesLedger.timestampUTC));
  }

  async updateStoreItem(vesselId: string, itemCode: string, updates: any): Promise<any> {
    logDbOperation('updateStoreItem', { vesselId, itemCode, updates });
    
    // Get current ROB for this item
    const currentItems = await this.getStoreItems(vesselId);
    const currentItem = currentItems.find(item => item.item_code === itemCode);
    
    if (!currentItem) {
      throw new Error('Store item not found');
    }

    // Store catalog info as JSON in remarks field until schema is updated
    const catalogInfo = {
      minStock: updates.minStock,
      notes: updates.notes,
      location: updates.location,
      updatedAt: new Date().toISOString()
    };

    // Create a new transaction with updated details
    const editTransaction = {
      vesselId,
      itemCode,
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
      remarks: JSON.stringify(catalogInfo)
    };

    await this.db.insert(storesLedger).values(editTransaction);
    
    // Force cache invalidation by adding a timestamp to response
    return { 
      ...editTransaction, 
      success: true, 
      timestamp: new Date().getTime(),
      updatedFields: updates 
    };
  }

  // Placeholder implementations for remaining IStorage methods
  async getChangeRequests(filters?: { category?: string; status?: string; q?: string; vesselId?: string }): Promise<ChangeRequest[]> {
    let query = this.db.select().from(changeRequest);
    if (filters?.vesselId) {
      query = query.where(eq(changeRequest.vesselId, filters.vesselId));
    }
    if (filters?.status) {
      query = query.where(eq(changeRequest.status, filters.status));
    }
    return await query;
  }

  // Stub methods - will implement as needed
  async getChangeRequestAttachments(): Promise<any[]> { return []; }
  async getChangeRequestComments(): Promise<any[]> { return []; }
  async updateChangeRequestTarget(): Promise<any> { throw new Error('Not implemented'); }
  async updateChangeRequestProposed(): Promise<any> { throw new Error('Not implemented'); }
  async submitChangeRequest(): Promise<any> { throw new Error('Not implemented'); }
  async approveChangeRequest(): Promise<any> { throw new Error('Not implemented'); }
  async rejectChangeRequest(): Promise<any> { throw new Error('Not implemented'); }
  async returnChangeRequest(): Promise<any> { throw new Error('Not implemented'); }
  async createChangeRequestAttachment(): Promise<any> { throw new Error('Not implemented'); }
  async createChangeRequestComment(): Promise<any> { throw new Error('Not implemented'); }

  // Work Orders methods
  async getWorkOrders(vesselId: string): Promise<WorkOrder[]> {
    logDbOperation('getWorkOrders', { vesselId });
    
    try {
      return await this.db.select()
        .from(workOrders)
        .where(eq(workOrders.vesselId, vesselId))
        .orderBy(desc(workOrders.createdAt));
    } catch (error) {
      console.error('Failed to get work orders:', error);
      
      // If table doesn't exist, create it and return empty array
      if (error instanceof Error && error.message.includes("doesn't exist")) {
        logDbOperation('getWorkOrders - table not found, creating table', {});
        await this.createWorkOrdersTable();
        return [];
      }
      
      throw error;
    }
  }

  private async createWorkOrdersTable(): Promise<void> {
    try {
      const connection = await this.pool.getConnection();
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS work_orders (
          id VARCHAR(100) PRIMARY KEY,
          vessel_id VARCHAR(50) NOT NULL DEFAULT 'V001',
          component VARCHAR(255) NOT NULL,
          component_code VARCHAR(100),
          work_order_no VARCHAR(50) NOT NULL,
          template_code VARCHAR(100),
          execution_id VARCHAR(100),
          job_title VARCHAR(500) NOT NULL,
          assigned_to VARCHAR(255) NOT NULL,
          due_date VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL,
          date_completed VARCHAR(50),
          submitted_date VARCHAR(50),
          form_data JSON,
          task_type VARCHAR(100),
          maintenance_basis VARCHAR(50),
          frequency_value VARCHAR(50),
          frequency_unit VARCHAR(50),
          approver_remarks TEXT,
          is_execution BOOLEAN DEFAULT FALSE,
          template_id VARCHAR(100),
          approver VARCHAR(255),
          approval_date VARCHAR(50),
          rejection_date VARCHAR(50),
          next_due_date VARCHAR(50),
          next_due_reading VARCHAR(50),
          current_reading VARCHAR(50),
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_wo_vessel (vessel_id),
          INDEX idx_wo_status (status),
          INDEX idx_wo_component (component_code),
          INDEX idx_wo_due_date (due_date)
        )
      `);
      connection.release();
      console.log('✅ Created work_orders table in MySQL RDS');
      
      console.log('✅ Work orders table ready for use');
    } catch (error) {
      console.error('❌ Failed to create work_orders table:', error);
    }
  }

  private async seedWorkOrdersData(): Promise<void> {
    try {
      const sampleWorkOrder = {
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
          componentCode: 'ME-001'
        }
      };

      await this.createWorkOrder(sampleWorkOrder);
      console.log('✅ Seeded sample work order data');
    } catch (error) {
      console.error('❌ Failed to seed work order data:', error);
    }
  }

  async createWorkOrder(workOrderData: InsertWorkOrder): Promise<WorkOrder> {
    logDbOperation('createWorkOrder', workOrderData);
    
    try {
      await this.db.insert(workOrders).values(workOrderData);
      
      // MySQL doesn't support RETURNING, so we fetch the inserted record
      const [newWorkOrder] = await this.db.select()
        .from(workOrders)
        .where(eq(workOrders.id, workOrderData.id))
        .limit(1);
      
      return newWorkOrder;
    } catch (error) {
      console.error('Failed to create work order:', error);
      throw error;
    }
  }

  async updateWorkOrder(workOrderId: string, workOrderData: Partial<InsertWorkOrder>): Promise<WorkOrder> {
    logDbOperation('updateWorkOrder', { workOrderId, ...workOrderData });
    
    try {
      await this.db.update(workOrders)
        .set(workOrderData)
        .where(eq(workOrders.id, workOrderId));
      
      // MySQL doesn't support RETURNING, so we fetch the updated record
      const [updatedWorkOrder] = await this.db.select()
        .from(workOrders)
        .where(eq(workOrders.id, workOrderId))
        .limit(1);
      
      return updatedWorkOrder;
    } catch (error) {
      console.error('Failed to update work order:', error);
      throw error;
    }
  }

  async deleteWorkOrder(workOrderId: string): Promise<void> {
    logDbOperation('deleteWorkOrder', { workOrderId });
    
    try {
      await this.db.delete(workOrders)
        .where(eq(workOrders.id, workOrderId));
    } catch (error) {
      console.error('Failed to delete work order:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const storage = new DatabaseStorage();
console.log('✅ Technical Module using MySQL RDS database for persistent storage');

// Seed some test store data if tables are empty
(async () => {
  try {
    // Check if we have any store data
    const existingStores = await storage.getStoreItems('V001');
    if (existingStores.length === 0) {
      console.log('🌱 Seeding test store data into MySQL...');
      
      // Add some initial store transactions
      const sampleStoreTransactions = [
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
          remarks: 'Initial stock'
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
          remarks: 'Initial stock'
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
          remarks: 'Initial stock'
        }
      ];

      for (const transaction of sampleStoreTransactions) {
        await storage.createStoreTransaction(transaction);
      }
      
      console.log('✅ Test store data seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding store data:', error);
  }
})();