
import { 
  users, type User, type InsertUser,
  spareParts, type SparePart, type InsertSparePart,
  spareComponents, type SpareComponent, type InsertSpareComponent,
  spareHistory, type SpareHistory, type InsertSpareHistory
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Spares Management methods
  getAllSpareParts(): Promise<SparePart[]>;
  getSparePart(id: number): Promise<SparePart | undefined>;
  getSparePartsByComponent(componentId: string): Promise<SparePart[]>;
  createSparePart(sparePart: InsertSparePart): Promise<SparePart>;
  updateSparePart(id: number, updates: Partial<InsertSparePart>): Promise<SparePart | undefined>;
  deleteSparePart(id: number): Promise<boolean>;
  
  getAllSpareComponents(): Promise<SpareComponent[]>;
  getSpareComponent(id: string): Promise<SpareComponent | undefined>;
  createSpareComponent(component: InsertSpareComponent): Promise<SpareComponent>;
  updateSpareComponent(id: string, updates: Partial<InsertSpareComponent>): Promise<SpareComponent | undefined>;
  
  getSpareHistory(sparePartId: number): Promise<SpareHistory[]>;
  createSpareHistoryEntry(history: InsertSpareHistory): Promise<SpareHistory>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private currentUserId: number;
  private spareParts: Map<number, SparePart>;
  private currentSparePartId: number;
  private spareComponents: Map<string, SpareComponent>;
  private spareHistories: Map<number, SpareHistory[]>;
  private currentHistoryId: number;

  constructor() {
    this.users = new Map();
    this.currentUserId = 1;
    this.spareParts = new Map();
    this.currentSparePartId = 1;
    this.spareComponents = new Map();
    this.spareHistories = new Map();
    this.currentHistoryId = 1;
    this.initializeSpareData();
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

  private initializeSpareData(): void {
    // Initialize spare components hierarchy
    const components: InsertSpareComponent[] = [
      { id: "1", name: "Ship General", parentId: null, level: 0, expanded: false },
      { id: "2", name: "Hull", parentId: null, level: 0, expanded: false },
      { id: "3", name: "Equipment for Cargo", parentId: null, level: 0, expanded: false },
      { id: "4", name: "Ship's Equipment", parentId: null, level: 0, expanded: false },
      { id: "5", name: "Equipment for Crew & Passengers", parentId: null, level: 0, expanded: false },
      { id: "6", name: "Machinery Main Components", parentId: null, level: 0, expanded: true },
      { id: "6.0", name: "Diesel Engines for Propulsion", parentId: "6", level: 1, expanded: true },
      { id: "6.01", name: "Diesel Engines", parentId: "6.0", level: 2, expanded: false },
      { id: "6.01.001", name: "Main Diesel Engines", parentId: "6.01", level: 3, expanded: false },
      { id: "6.01.002", name: "ME cylinder covers w/ valves", parentId: "6.01", level: 3, expanded: false },
      { id: "7", name: "Systems for Machinery Main Components", parentId: null, level: 0, expanded: false },
      { id: "8", name: "Ship Common Systems", parentId: null, level: 0, expanded: false }
    ];

    components.forEach(component => {
      const spareComponent: SpareComponent = {
        id: component.id,
        name: component.name,
        parentId: component.parentId || null,
        level: component.level || 0,
        expanded: component.expanded || false,
        createdAt: new Date()
      };
      this.spareComponents.set(component.id, spareComponent);
    });

    // Initialize sample spare parts data
    const sampleParts: InsertSparePart[] = [
      {
        partCode: "SP-ME-001",
        partName: "Fuel Injector",
        component: "Main Engine #1 (Wartsila 8L46F)",
        componentId: "6.01.001",
        critical: "Yes",
        rob: 2,
        minStock: 1,
        location: "Store Room A",
        vessel: "Vessel 1"
      },
      {
        partCode: "SP-ME-002",
        partName: "Cylinder Head Gasket",
        component: "Main Engine #1 (Wartsila 8L46F)",
        componentId: "6.01.001",
        critical: "No",
        rob: 2,
        minStock: 1,
        location: "Store Room B",
        vessel: "Vessel 1"
      },
      {
        partCode: "SP-ME-003",
        partName: "Piston Ring Set",
        component: "Main Engine #1 (Wartsila 8L46F)",
        componentId: "6.01.001",
        critical: "No",
        rob: 3,
        minStock: 1,
        location: "Store Room B",
        vessel: "Vessel 1"
      },
      {
        partCode: "SP-COOL-001",
        partName: "Cooling Pump Seal",
        component: "Main Engine Cooling System",
        componentId: "6",
        critical: "Critical",
        rob: 4,
        minStock: 2,
        location: "Store Room D",
        vessel: "Vessel 1"
      }
    ];

    sampleParts.forEach(part => {
      const sparePart: SparePart = {
        id: this.currentSparePartId++,
        partCode: part.partCode,
        partName: part.partName,
        component: part.component,
        componentId: part.componentId,
        critical: part.critical || "No",
        rob: part.rob || 0,
        minStock: part.minStock || 0,
        location: part.location,
        vessel: part.vessel || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.spareParts.set(sparePart.id, sparePart);
    });
  }

  // Spare Parts methods
  async getAllSpareParts(): Promise<SparePart[]> {
    return Array.from(this.spareParts.values());
  }

  async getSparePart(id: number): Promise<SparePart | undefined> {
    return this.spareParts.get(id);
  }

  async getSparePartsByComponent(componentId: string): Promise<SparePart[]> {
    return Array.from(this.spareParts.values()).filter(
      part => part.componentId === componentId
    );
  }

  async createSparePart(insertSparePart: InsertSparePart): Promise<SparePart> {
    const id = this.currentSparePartId++;
    const sparePart: SparePart = {
      id,
      partCode: insertSparePart.partCode,
      partName: insertSparePart.partName,
      component: insertSparePart.component,
      componentId: insertSparePart.componentId,
      critical: insertSparePart.critical || "No",
      rob: insertSparePart.rob || 0,
      minStock: insertSparePart.minStock || 0,
      location: insertSparePart.location,
      vessel: insertSparePart.vessel || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.spareParts.set(id, sparePart);
    return sparePart;
  }

  async updateSparePart(id: number, updates: Partial<InsertSparePart>): Promise<SparePart | undefined> {
    const existing = this.spareParts.get(id);
    if (!existing) return undefined;

    const updated: SparePart = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.spareParts.set(id, updated);
    return updated;
  }

  async deleteSparePart(id: number): Promise<boolean> {
    return this.spareParts.delete(id);
  }

  // Spare Components methods
  async getAllSpareComponents(): Promise<SpareComponent[]> {
    return Array.from(this.spareComponents.values());
  }

  async getSpareComponent(id: string): Promise<SpareComponent | undefined> {
    return this.spareComponents.get(id);
  }

  async createSpareComponent(insertComponent: InsertSpareComponent): Promise<SpareComponent> {
    const component: SpareComponent = {
      id: insertComponent.id,
      name: insertComponent.name,
      parentId: insertComponent.parentId || null,
      level: insertComponent.level || 0,
      expanded: insertComponent.expanded || false,
      createdAt: new Date()
    };
    this.spareComponents.set(insertComponent.id, component);
    return component;
  }

  async updateSpareComponent(id: string, updates: Partial<InsertSpareComponent>): Promise<SpareComponent | undefined> {
    const existing = this.spareComponents.get(id);
    if (!existing) return undefined;

    const updated: SpareComponent = {
      ...existing,
      ...updates
    };
    this.spareComponents.set(id, updated);
    return updated;
  }

  // Spare History methods
  async getSpareHistory(sparePartId: number): Promise<SpareHistory[]> {
    return this.spareHistories.get(sparePartId) || [];
  }

  async createSpareHistoryEntry(insertHistory: InsertSpareHistory): Promise<SpareHistory> {
    const id = this.currentHistoryId++;
    const history: SpareHistory = {
      id,
      sparePartId: insertHistory.sparePartId,
      action: insertHistory.action,
      quantity: insertHistory.quantity,
      previousStock: insertHistory.previousStock || null,
      newStock: insertHistory.newStock || null,
      location: insertHistory.location || null,
      notes: insertHistory.notes || null,
      performedBy: insertHistory.performedBy || null,
      performedAt: new Date()
    };

    const histories = this.spareHistories.get(insertHistory.sparePartId) || [];
    histories.push(history);
    this.spareHistories.set(insertHistory.sparePartId, histories);

    return history;
  }
}

// Use in-memory storage for Technical Module
const storage: IStorage = new MemStorage();
console.log("ℹ️  Technical Module using in-memory storage for development");

export { storage };
