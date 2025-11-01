import express from 'express';
import userRoutes from './routes/users';

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// API routes
app.use('/api/users', userRoutes);

export default app;