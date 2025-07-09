import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { 
  users, 
  forms, 
  rankGroups, 
  availableRanks, 
  crewMembers, 
  appraisalResults
} from "../shared/schema";

async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  const db = drizzle(pool);

  try {
    console.log("Testing database connection...");
    
    // Test connection
    const client = await pool.connect();
    console.log("✓ Database connection successful");
    client.release();

    // Create tables if they don't exist
    console.log("Creating tables...");
    
    // The tables should be created by drizzle-kit push
    // But let's verify they exist
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `;
    
    const result = await db.execute(tablesQuery);
    console.log("Existing tables:", result.rows.map(row => row.table_name));
    
    console.log("✓ Database initialization complete");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initializeDatabase();