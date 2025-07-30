import 'tsconfig-paths/register';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { config } from "dotenv";
import * as mysql from 'mysql2/promise'; // Ensure to import mysql2

// Load environment variables from .env file
config(); 
console.log("DATABASE_URL:", process.env.DATABASE_URL);

async function connectToDatabase() {
  try {
    // Check if DATABASE_URL is defined before using it
    if (!process.env.DATABASE_URL) {
      console.log("No DATABASE_URL found, skipping database connection test");
      return;
    }
    
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    console.log("Database connected successfully");
    await connection.end(); // Close the test connection
  } catch (error) {
    console.error("Database connection failed", error);
  }
}

// Call the function to test the connection
connectToDatabase();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0", // Ensure it listens on all interfaces
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();