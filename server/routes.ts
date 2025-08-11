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

  const httpServer = createServer(app);

  return httpServer;
}
