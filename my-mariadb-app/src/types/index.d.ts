// TypeScript type definitions for the project

// User model interface
export interface User {
    id: number;
    username: string;
    email: string;
    password: string; // Consider using a hashed password in production
}

// Database connection options interface
export interface DbConnectionOptions {
    host: string;
    user: string;
    password: string;
    database: string;
}

// API response structure for user-related operations
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}