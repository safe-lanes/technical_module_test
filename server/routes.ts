import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRunningHoursAuditSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Running Hours API routes
  
  // Get components for a vessel
  app.get("/api/running-hours/components/:vesselId", async (req, res) => {
    try {
      const components = await storage.getComponents(req.params.vesselId);
      res.json(components);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch components" });
    }
  });

  // Update component running hours
  app.post("/api/running-hours/update/:componentId", async (req, res) => {
    try {
      const { componentId } = req.params;
      const updateData = req.body;
      
      // Create audit entry
      const audit = await storage.createRunningHoursAudit(updateData.audit);
      
      // Update component
      const component = await storage.updateComponent(componentId, {
        currentCumulativeRH: updateData.cumulativeRH.toString(),
        lastUpdated: updateData.dateUpdatedLocal
      });
      
      res.json({ component, audit });
    } catch (error) {
      res.status(500).json({ error: "Failed to update running hours" });
    }
  });

  // Bulk update running hours
  app.post("/api/running-hours/bulk-update", async (req, res) => {
    try {
      const updates = req.body.updates;
      const results = [];
      
      for (const update of updates) {
        const audit = await storage.createRunningHoursAudit(update.audit);
        const component = await storage.updateComponent(update.componentId, {
          currentCumulativeRH: update.cumulativeRH.toString(),
          lastUpdated: update.dateUpdatedLocal
        });
        results.push({ component, audit });
      }
      
      res.json({ results });
    } catch (error) {
      res.status(500).json({ error: "Failed to perform bulk update" });
    }
  });

  // Get running hours audits for a component
  app.get("/api/running-hours/audits/:componentId", async (req, res) => {
    try {
      const { componentId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const audits = await storage.getRunningHoursAudits(componentId, limit);
      res.json(audits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audits" });
    }
  });

  // Get utilization rate for components
  app.post("/api/running-hours/utilization-rates", async (req, res) => {
    try {
      const { componentIds } = req.body;
      const rates: Record<string, number | null> = {};
      
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      for (const componentId of componentIds) {
        const audits = await storage.getRunningHoursAuditsInDateRange(
          componentId,
          thirtyDaysAgo,
          today
        );
        
        // Get anchor point (most recent before window)
        const allAudits = await storage.getRunningHoursAudits(componentId);
        const anchorAudit = allAudits.find(a => new Date(a.dateUpdatedLocal) < thirtyDaysAgo);
        
        const windowAudits = anchorAudit ? [anchorAudit, ...audits] : audits;
        
        if (windowAudits.length < 2) {
          rates[componentId] = null;
        } else {
          const start = windowAudits[0];
          const end = windowAudits[windowAudits.length - 1];
          
          const deltaHours = parseFloat(end.cumulativeRH) - parseFloat(start.cumulativeRH);
          const startDate = new Date(start.dateUpdatedLocal);
          const endDate = new Date(end.dateUpdatedLocal);
          const deltaDays = Math.max((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24), 1);
          
          const utilization = Math.max(deltaHours / deltaDays, 0);
          rates[componentId] = Math.round(utilization * 10) / 10;
        }
      }
      
      res.json(rates);
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate utilization rates" });
    }
  });

  // Spares API routes
  
  // Get all spares for a vessel
  app.get("/api/spares/:vesselId", async (req, res) => {
    try {
      const spares = await storage.getSpares(req.params.vesselId);
      // Calculate stock status server-side
      const sparesWithStatus = spares.map(spare => ({
        ...spare,
        stockStatus: spare.rob < spare.min ? 'Low' : spare.rob === spare.min ? 'Minimum' : 'OK'
      }));
      res.json(sparesWithStatus);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch spares" });
    }
  });

  // Get single spare
  app.get("/api/spares/item/:id", async (req, res) => {
    try {
      const spare = await storage.getSpare(parseInt(req.params.id));
      if (!spare) {
        return res.status(404).json({ error: "Spare not found" });
      }
      res.json(spare);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch spare" });
    }
  });

  // Create new spare
  app.post("/api/spares", async (req, res) => {
    try {
      const spare = await storage.createSpare(req.body);
      res.json(spare);
    } catch (error) {
      res.status(500).json({ error: "Failed to create spare" });
    }
  });

  // Update spare
  app.put("/api/spares/:id", async (req, res) => {
    try {
      const spare = await storage.updateSpare(parseInt(req.params.id), req.body);
      res.json(spare);
    } catch (error) {
      res.status(500).json({ error: "Failed to update spare" });
    }
  });

  // Delete spare
  app.delete("/api/spares/:id", async (req, res) => {
    try {
      await storage.deleteSpare(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete spare" });
    }
  });

  // Consume spare
  app.post("/api/spares/:id/consume", async (req, res) => {
    try {
      const { vesselId, qty, dateLocal, tz, place, remarks, userId } = req.body;
      
      // Validation
      if (!qty || qty < 1) {
        return res.status(400).json({ error: "Quantity must be at least 1" });
      }
      
      // Check if date is not in future
      const today = new Date();
      const inputDate = new Date(dateLocal);
      if (inputDate > today) {
        return res.status(400).json({ error: "Date cannot be in the future" });
      }
      
      const spare = await storage.consumeSpare(
        parseInt(req.params.id),
        qty,
        userId || 'user',
        remarks,
        place,
        dateLocal,
        tz || 'UTC'
      );
      
      // Calculate stock status for response
      const spareWithStatus = {
        ...spare,
        stockStatus: spare.rob < spare.min ? 'Low' : spare.rob === spare.min ? 'Minimum' : 'OK'
      };
      
      res.json(spareWithStatus);
    } catch (error: any) {
      if (error.message === 'Insufficient stock') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to consume spare" });
      }
    }
  });

  // Receive spare
  app.post("/api/spares/:id/receive", async (req, res) => {
    try {
      const { vesselId, qty, dateLocal, tz, place, supplierPO, remarks, userId } = req.body;
      
      // Validation
      if (!qty || qty < 1) {
        return res.status(400).json({ error: "Quantity must be at least 1" });
      }
      
      // Check if date is not in future
      const today = new Date();
      const inputDate = new Date(dateLocal);
      if (inputDate > today) {
        return res.status(400).json({ error: "Date cannot be in the future" });
      }
      
      const spare = await storage.receiveSpare(
        parseInt(req.params.id),
        qty,
        userId || 'user',
        remarks,
        supplierPO,
        place,
        dateLocal,
        tz || 'UTC'
      );
      
      // Calculate stock status for response
      const spareWithStatus = {
        ...spare,
        stockStatus: spare.rob < spare.min ? 'Low' : spare.rob === spare.min ? 'Minimum' : 'OK'
      };
      
      res.json(spareWithStatus);
    } catch (error) {
      res.status(500).json({ error: "Failed to receive spare" });
    }
  });

  // Bulk update spares
  app.post("/api/spares/bulk-update", async (req, res) => {
    try {
      const { updates, userId, remarks } = req.body;
      const updatedSpares = await storage.bulkUpdateSpares(
        updates,
        userId || 'user',
        remarks
      );
      res.json(updatedSpares);
    } catch (error: any) {
      if (error.message?.includes('Insufficient stock')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to perform bulk update" });
      }
    }
  });

  // Get spares history
  app.get("/api/spares/history/:vesselId", async (req, res) => {
    try {
      const history = await storage.getSpareHistory(req.params.vesselId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // Get history for specific spare
  app.get("/api/spares/history/spare/:spareId", async (req, res) => {
    try {
      const history = await storage.getSpareHistoryBySpareId(parseInt(req.params.spareId));
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch spare history" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
