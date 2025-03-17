# Frontend Import Migration Scripts

This directory contains scripts to help migrate frontend imports to use the shared package. These scripts automate the process of identifying components, utilities, hooks, and types that have been moved to the shared package and updating import statements in frontend files.

## Scripts Overview

### 1. Component Inventory Generator (`component-inventory.js`)

This script analyzes the shared package and frontend codebase to create an inventory of components, utilities, hooks, and types that have been moved to the shared package and identifies their usage in the frontend.

**Usage:**

```bash
node scripts/component-inventory.js
```

**Output:**

The script generates a markdown report at `docs/component-inventory.md` containing:
- Summary of shared components and their usage in frontend
- Detailed usage information for each component
- Migration recommendations

### 2. Import Migration Script (`migrate-imports.js`)

This script updates import statements in a specified file to use the shared package based on the component inventory.

**Usage:**

```bash
node scripts/migrate-imports.js <file-path> [--dry-run] [--verbose]
```

**Options:**
- `<file-path>`: Path to the file to migrate
- `--dry-run`: Show changes without applying them
- `--verbose`: Show detailed information about the migration process

**Example:**

```bash
# Migrate a specific file
node scripts/migrate-imports.js frontend/src/components/Dashboard.tsx

# Perform a dry run to see what would be changed
node scripts/migrate-imports.js frontend/src/components/Dashboard.tsx --dry-run

# Show detailed information during migration
node scripts/migrate-imports.js frontend/src/components/Dashboard.tsx --verbose
```

### 3. Batch Migration Script (`batch-migrate.js`)

This script automates the migration of multiple frontend files in batches based on the component inventory.

**Usage:**

```bash
node scripts/batch-migrate.js [options]
```

**Options:**
- `--dry-run`: Show changes without applying them
- `--verbose`: Show detailed information
- `--batch-size=N`: Number of files to process in each batch (default: 5)
- `--category=NAME`: Only migrate files using components from the specified category

**Example:**

```bash
# Migrate all files in batches of 5
node scripts/batch-migrate.js

# Migrate only files using components from the "Components" category
node scripts/batch-migrate.js --category=Components

# Perform a dry run with a batch size of 10
node scripts/batch-migrate.js --dry-run --batch-size=10
```

### 4. Migration Test Script (`test-migration.js`)

This script tests the migration scripts by creating temporary test files and verifying that imports are correctly migrated.

**Usage:**

```bash
node scripts/test-migration.js
```

## Migration Workflow

1. **Generate Component Inventory**:
   ```bash
   node scripts/component-inventory.js
   ```

2. **Review the Inventory**:
   Open `docs/component-inventory.md` to review the components and their usage in the frontend.

3. **Test the Migration Scripts**:
   ```bash
   node scripts/test-migration.js
   ```

4. **Perform a Dry Run on a Few Files**:
   ```bash
   node scripts/batch-migrate.js --dry-run --batch-size=3
   ```

5. **Migrate Files in Batches**:
   ```bash
   node scripts/batch-migrate.js
   ```

6. **Verify the Changes**:
   Test the frontend to ensure it works correctly with the updated imports.

## Best Practices

1. **Always back up your code** before running migration scripts.
2. **Start with a dry run** to see what changes would be made.
3. **Migrate in small batches** to make it easier to identify and fix issues.
4. **Test thoroughly** after each batch to ensure the application still works correctly.
5. **Review the changes** in version control before committing them.

## Troubleshooting

If you encounter issues during migration:

1. **Check the component inventory** to ensure it correctly identifies the components and their usage.
2. **Run the migration script with the `--verbose` flag** to see detailed information about the migration process.
3. **Manually fix any issues** that the scripts cannot handle automatically.
4. **Run the test script** to verify that the migration scripts are working correctly.

## Contributing

If you find issues with the migration scripts or have suggestions for improvements, please open an issue or submit a pull request. 