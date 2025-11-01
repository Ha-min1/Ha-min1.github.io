# My MariaDB App

## Overview
My MariaDB App is a TypeScript-based application that utilizes an embedded MariaDB instance for data storage. This project provides a simple API for managing user data and demonstrates how to set up and interact with an embedded database.

## Project Structure
```
my-mariadb-app
├── src
│   ├── index.ts              # Entry point of the application
│   ├── server.ts             # Express server setup
│   ├── api
│   │   ├── app.ts            # API routes configuration
│   │   └── routes
│   │       └── users.ts      # User-related routes
│   ├── db
│   │   ├── embedded-mariadb.ts # Logic to manage embedded MariaDB
│   │   ├── connection.ts      # Database connection logic
│   │   ├── migrations
│   │   │   └── 001_init.sql   # Database initialization SQL
│   │   └── models
│   │       └── user.ts        # User model definition
│   ├── config
│   │   └── index.ts           # Configuration settings
│   └── types
│       └── index.d.ts         # Type definitions
├── scripts
│   ├── start-embedded-mariadb.sh # Script to start the embedded MariaDB
│   └── migrate.sh              # Script to run database migrations
├── docker
│   └── mariadb.cnf            # MariaDB server configuration
├── tests
│   └── db.test.ts             # Tests for database interactions
├── .env.example                # Example environment variables
├── package.json                # npm configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                   # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (version >= 14)
- npm (Node package manager)
- TypeScript (installed globally)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/my-mariadb-app.git
   cd my-mariadb-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application
To start the embedded MariaDB instance and the application, run:
```
npm run start
```

### Running Migrations
To initialize the database schema, run:
```
npm run migrate
```

### Running Tests
To execute the tests for database interactions, run:
```
npm test
```

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For any inquiries or contributions, please reach out to [your-email@example.com].