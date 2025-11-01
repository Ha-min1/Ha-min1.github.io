import express from 'express';
import { json } from 'body-parser';
import { connectToDatabase } from './db/connection';
import appRoutes from './api/app';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());

// Connect to the embedded MariaDB
connectToDatabase()
    .then(() => {
        console.log('Connected to the embedded MariaDB');
        
        // Set up routes
        app.use('/api', appRoutes);

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });