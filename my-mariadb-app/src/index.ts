import express from 'express';
import { startEmbeddedMariaDB } from './db/embedded-mariadb';
import { connectToDatabase } from './db/connection';
import app from './api/app';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await startEmbeddedMariaDB();
        await connectToDatabase();

        const server = express();
        server.use(express.json());
        server.use('/api', app);

        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

startServer();