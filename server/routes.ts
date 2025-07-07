import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFormSchema, insertRankGroupSchema, insertAvailableRankSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Forms API routes
  app.get("/api/forms", async (req, res) => {
    try {
      const forms = await storage.getForms();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forms" });
    }
  });

  app.get("/api/forms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const form = await storage.getForm(id);
      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }
      res.json(form);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch form" });
    }
  });

  app.post("/api/forms", async (req, res) => {
    try {
      const result = insertFormSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid form data", details: result.error.issues });
      }
      const form = await storage.createForm(result.data);
      res.json(form);
    } catch (error) {
      res.status(500).json({ error: "Failed to create form" });
    }
  });

  app.put("/api/forms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertFormSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid form data", details: result.error.issues });
      }
      const form = await storage.updateForm(id, result.data);
      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }
      res.json(form);
    } catch (error) {
      res.status(500).json({ error: "Failed to update form" });
    }
  });

  app.delete("/api/forms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteForm(id);
      if (!deleted) {
        return res.status(404).json({ error: "Form not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete form" });
    }
  });

  // Rank Groups API routes
  app.get("/api/rank-groups/:formId", async (req, res) => {
    try {
      const formId = parseInt(req.params.formId);
      const rankGroups = await storage.getRankGroups(formId);
      res.json(rankGroups);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rank groups" });
    }
  });

  app.post("/api/rank-groups", async (req, res) => {
    try {
      const validatedData = insertRankGroupSchema.parse(req.body);
      const rankGroup = await storage.createRankGroup(validatedData);
      res.status(201).json(rankGroup);
    } catch (error) {
      res.status(400).json({ error: "Invalid rank group data" });
    }
  });

  app.put("/api/rank-groups/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertRankGroupSchema.partial().parse(req.body);
      const rankGroup = await storage.updateRankGroup(id, validatedData);
      if (!rankGroup) {
        return res.status(404).json({ error: "Rank group not found" });
      }
      res.json(rankGroup);
    } catch (error) {
      res.status(400).json({ error: "Invalid rank group data" });
    }
  });

  app.delete("/api/rank-groups/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteRankGroup(id);
      if (!deleted) {
        return res.status(404).json({ error: "Rank group not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete rank group" });
    }
  });

  // Available Ranks API routes
  app.get("/api/available-ranks", async (req, res) => {
    try {
      const ranks = await storage.getAvailableRanks();
      res.json(ranks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch available ranks" });
    }
  });

  app.post("/api/available-ranks", async (req, res) => {
    try {
      const validatedData = insertAvailableRankSchema.parse(req.body);
      const rank = await storage.createAvailableRank(validatedData);
      res.status(201).json(rank);
    } catch (error) {
      res.status(400).json({ error: "Invalid rank data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
