// @ts-nocheck
import { DatabaseStorage } from '../database';
import { readdir } from 'fs/promises';
import { join } from 'path';

export interface Migration {
  id: string;
  name: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

export class MigrationRunner {
  private storage: DatabaseStorage;

  constructor(storage: DatabaseStorage) {
    this.storage = storage;
  }

  async runMigrations(): Promise<void> {
    const migrationsPath = join(__dirname, '.');
    const migrationFiles = await readdir(migrationsPath);

    // Filter for migration files (exclude this runner)
    const migrations = migrationFiles
      .filter(file => file.startsWith('migration_') && file.endsWith('.ts'))
      .sort();

    console.log(`Found ${migrations.length} migration files`);

    for (const migrationFile of migrations) {
      const migrationModule = await import(join(migrationsPath, migrationFile));
      const migration: Migration = migrationModule.default;

      try {
        await migration.up();
        console.log(
          `✓ Migration ${migration.id} (${migration.name}) completed`
        );
      } catch (error) {
        console.error(`✗ Migration ${migration.id} failed:`, error);
        throw error;
      }
    }
  }

  async rollbackMigration(migrationId: string): Promise<void> {
    const migrationsPath = join(__dirname, '.');
    const migrationFiles = await readdir(migrationsPath);

    const migrationFile = migrationFiles.find(
      file => file.includes(migrationId) && file.endsWith('.ts')
    );

    if (!migrationFile) {
      throw new Error(`Migration ${migrationId} not found`);
    }

    const migrationModule = await import(join(migrationsPath, migrationFile));
    const migration: Migration = migrationModule.default;

    try {
      await migration.down();
      console.log(
        `✓ Migration ${migration.id} (${migration.name}) rolled back`
      );
    } catch (error) {
      console.error(`✗ Migration rollback ${migration.id} failed:`, error);
      throw error;
    }
  }
}
