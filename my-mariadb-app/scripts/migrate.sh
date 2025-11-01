#!/bin/bash

# Navigate to the directory containing the SQL migration files
cd "$(dirname "$0")/../src/db/migrations"

# Run the migration using the embedded MariaDB instance
# Assuming the embedded MariaDB is already running and accessible
for sql_file in *.sql; do
    echo "Running migration: $sql_file"
    mariadb --user=root --password=root_password < "$sql_file"
done

echo "Database migrations completed."