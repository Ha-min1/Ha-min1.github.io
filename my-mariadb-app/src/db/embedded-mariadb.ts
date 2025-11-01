import { createServer } from 'mariadb';
import { join } from 'path';
import { promises as fs } from 'fs';

const DB_PATH = join(__dirname, 'my-database.db');

export const startEmbeddedMariaDB = async () => {
    const server = createServer({
        socket: {
            path: DB_PATH,
        },
        // Additional configuration options can be added here
    });

    try {
        await server.start();
        console.log('Embedded MariaDB started successfully.');
    } catch (error) {
        console.error('Failed to start Embedded MariaDB:', error);
    }

    // Load initial migrations
    await loadMigrations();
};

const loadMigrations = async () => {
    const migrationFilePath = join(__dirname, 'migrations', '001_init.sql');
    try {
        const migrationSQL = await fs.readFile(migrationFilePath, 'utf-8');
        await server.query(migrationSQL);
        console.log('Migrations loaded successfully.');
    } catch (error) {
        console.error('Failed to load migrations:', error);
    }
};