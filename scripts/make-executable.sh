#!/bin/bash

# Make migration scripts executable
chmod +x scripts/component-inventory.js
chmod +x scripts/migrate-imports.js
chmod +x scripts/batch-migrate.js
chmod +x scripts/test-migration.js

echo "Migration scripts are now executable."
echo "You can run them directly:"
echo "  ./scripts/component-inventory.js"
echo "  ./scripts/migrate-imports.js <file-path>"
echo "  ./scripts/batch-migrate.js"
echo "  ./scripts/test-migration.js" 