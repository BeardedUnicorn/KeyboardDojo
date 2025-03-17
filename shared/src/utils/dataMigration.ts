import { storageService } from './storage';

// Interface for migration
interface Migration {
  version: number;
  description: string;
  migrate: () => Promise<void>;
}

/**
 * Data migration utility
 * This utility handles data schema migrations for the application
 * It ensures that stored data is compatible with the current application version
 */
class DataMigrationService {
  private migrations: Migration[] = [];
  private readonly CURRENT_VERSION_KEY = 'data-schema-version';
  private currentVersion = 0;
  private targetVersion = 0;
  private isInitialized = false;

  constructor() {
    // Initialize the service
    this.init();
  }

  /**
   * Initialize the migration service
   */
  private async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load the current schema version
      this.currentVersion = await storageService.getItem<number>(this.CURRENT_VERSION_KEY, 0) || 0;
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize migration service:', error);
    }
  }

  /**
   * Register a migration
   * @param migration The migration to register
   */
  registerMigration(migration: Migration): void {
    // Check if the migration is already registered
    const existingIndex = this.migrations.findIndex(m => m.version === migration.version);
    if (existingIndex !== -1) {
      console.warn(`Migration for version ${migration.version} is already registered. Skipping.`);
      return;
    }

    // Add the migration
    this.migrations.push(migration);

    // Sort migrations by version
    this.migrations.sort((a, b) => a.version - b.version);

    // Update the target version
    this.targetVersion = Math.max(this.targetVersion, migration.version);
  }

  /**
   * Register multiple migrations
   * @param migrations The migrations to register
   */
  registerMigrations(migrations: Migration[]): void {
    for (const migration of migrations) {
      this.registerMigration(migration);
    }
  }

  /**
   * Check if migrations are needed
   * @returns True if migrations are needed
   */
  async needsMigration(): Promise<boolean> {
    await this.init();
    return this.currentVersion < this.targetVersion;
  }

  /**
   * Run all pending migrations
   * @returns Promise that resolves when all migrations are complete
   */
  async migrate(): Promise<void> {
    await this.init();

    if (this.currentVersion >= this.targetVersion) {
      console.log('No migrations needed.');
      return;
    }

    console.log(`Migrating data from version ${this.currentVersion} to ${this.targetVersion}`);

    // Get pending migrations
    const pendingMigrations = this.migrations.filter(m => m.version > this.currentVersion);

    // Run migrations in order
    for (const migration of pendingMigrations) {
      try {
        console.log(`Running migration to version ${migration.version}: ${migration.description}`);
        await migration.migrate();
        
        // Update the current version
        this.currentVersion = migration.version;
        await storageService.setItem(this.CURRENT_VERSION_KEY, this.currentVersion);
        
        console.log(`Migration to version ${migration.version} complete.`);
      } catch (error) {
        console.error(`Migration to version ${migration.version} failed:`, error);
        throw error;
      }
    }

    console.log('All migrations complete.');
  }

  /**
   * Get the current data schema version
   * @returns The current version
   */
  getCurrentVersion(): number {
    return this.currentVersion;
  }

  /**
   * Get the target data schema version
   * @returns The target version
   */
  getTargetVersion(): number {
    return this.targetVersion;
  }

  /**
   * Reset the data schema version
   * This is useful for testing or development
   * @param version The version to reset to
   */
  async resetVersion(version: number): Promise<void> {
    this.currentVersion = version;
    await storageService.setItem(this.CURRENT_VERSION_KEY, version);
  }
}

// Export a singleton instance
export const dataMigrationService = new DataMigrationService();

// Example migration
/*
dataMigrationService.registerMigration({
  version: 1,
  description: 'Add user preferences',
  migrate: async () => {
    // Example migration logic
    const defaultPreferences = {
      theme: 'light',
      fontSize: 16,
      keyboardLayout: 'qwerty',
    };
    
    await storageService.setItem('user-preferences', defaultPreferences);
  },
});
*/ 