import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSparePartSchema, 
  insertSpareComponentSchema, 
  insertSpareHistorySchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Spares Management API Routes
  
  // Get all spare parts
  app.get("/api/spares/parts", async (req, res) => {
    try {
      const parts = await storage.getAllSpareParts();
      res.json(parts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch spare parts" });
    }
  });

  // Get spare part by ID
  app.get("/api/spares/parts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid spare part ID" });
      }
      
      const part = await storage.getSparePart(id);
      if (!part) {
        return res.status(404).json({ error: "Spare part not found" });
      }
      
      res.json(part);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch spare part" });
    }
  });

  // Get spare parts by component
  app.get("/api/spares/parts/component/:componentId", async (req, res) => {
    try {
      const componentId = req.params.componentId;
      const parts = await storage.getSparePartsByComponent(componentId);
      res.json(parts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch spare parts for component" });
    }
  });

  // Create new spare part
  app.post("/api/spares/parts", async (req, res) => {
    try {
      const validatedData = insertSparePartSchema.parse(req.body);
      const newPart = await storage.createSparePart(validatedData);
      res.status(201).json(newPart);
    } catch (error) {
      console.error("Failed to create spare part:", error);
      res.status(400).json({ error: "Invalid spare part data" });
    }
  });

  // Update spare part
  app.patch("/api/spares/parts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid spare part ID" });
      }

      const updates = req.body;
      const updatedPart = await storage.updateSparePart(id, updates);
      
      if (!updatedPart) {
        return res.status(404).json({ error: "Spare part not found" });
      }
      
      res.json(updatedPart);
    } catch (error) {
      res.status(500).json({ error: "Failed to update spare part" });
    }
  });

  // Delete spare part
  app.delete("/api/spares/parts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid spare part ID" });
      }

      const deleted = await storage.deleteSparePart(id);
      if (!deleted) {
        return res.status(404).json({ error: "Spare part not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete spare part" });
    }
  });

  // Get all spare components
  app.get("/api/spares/components", async (req, res) => {
    try {
      const components = await storage.getAllSpareComponents();
      res.json(components);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch spare components" });
    }
  });

  // Get spare component by ID
  app.get("/api/spares/components/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const component = await storage.getSpareComponent(id);
      
      if (!component) {
        return res.status(404).json({ error: "Spare component not found" });
      }
      
      res.json(component);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch spare component" });
    }
  });

  // Create new spare component
  app.post("/api/spares/components", async (req, res) => {
    try {
      const validatedData = insertSpareComponentSchema.parse(req.body);
      const newComponent = await storage.createSpareComponent(validatedData);
      res.status(201).json(newComponent);
    } catch (error) {
      console.error("Failed to create spare component:", error);
      res.status(400).json({ error: "Invalid spare component data" });
    }
  });

  // Update spare component
  app.patch("/api/spares/components/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const updatedComponent = await storage.updateSpareComponent(id, updates);
      
      if (!updatedComponent) {
        return res.status(404).json({ error: "Spare component not found" });
      }
      
      res.json(updatedComponent);
    } catch (error) {
      res.status(500).json({ error: "Failed to update spare component" });
    }
  });

  // Get spare history for a part
  app.get("/api/spares/history/:partId", async (req, res) => {
    try {
      const partId = parseInt(req.params.partId);
      if (isNaN(partId)) {
        return res.status(400).json({ error: "Invalid spare part ID" });
      }
      
      const history = await storage.getSpareHistory(partId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch spare history" });
    }
  });

  // Create spare history entry
  app.post("/api/spares/history", async (req, res) => {
    try {
      const validatedData = insertSpareHistorySchema.parse(req.body);
      const newHistory = await storage.createSpareHistoryEntry(validatedData);
      res.status(201).json(newHistory);
    } catch (error) {
      console.error("Failed to create spare history entry:", error);
      res.status(400).json({ error: "Invalid spare history data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
