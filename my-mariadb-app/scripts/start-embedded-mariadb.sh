#!/bin/bash

# Start the embedded MariaDB instance

# Set the path to the MariaDB installation
MARIADB_PATH="/path/to/embedded/mariadb"

# Set the data directory for MariaDB
DATA_DIR="$MARIADB_PATH/data"

# Create the data directory if it doesn't exist
mkdir -p "$DATA_DIR"

# Start the embedded MariaDB server
"$MARIADB_PATH/bin/mysqld" --datadir="$DATA_DIR" --socket="$DATA_DIR/mysqld.sock" --port=3306 --skip-networking &

# Wait for the server to start
sleep 5

# Print the status
if pgrep -x "mysqld" > /dev/null; then
    echo "Embedded MariaDB started successfully."
else
    echo "Failed to start Embedded MariaDB."
fi