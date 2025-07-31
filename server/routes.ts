import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// No crew-specific imports needed for Technical Module

export async function registerRoutes(app: Express): Promise<Server> {
  // Technical Module API routes will be added here as needed
  // Currently no specific routes required for Technical Module

  const httpServer = createServer(app);

  return httpServer;
}
