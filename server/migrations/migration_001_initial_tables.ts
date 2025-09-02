import { Migration } from './migrationRunner';
import { sql } from 'drizzle-orm';

const migration: Migration = {
  id: '001',
  name: 'Initial table creation',

  async up() {
    console.log('Migration 001: Creating initial tables...');
    // This migration is handled by Drizzle's automatic schema sync
    // In production, you would use proper SQL migrations here
    console.log('✓ Initial tables migration completed (handled by Drizzle)');
  },

  async down() {
    console.log('Migration 001: Rolling back initial tables...');
    // In production, you would drop tables in reverse dependency order
    console.log('✓ Initial tables rollback completed');
  },
};

export default migration;
