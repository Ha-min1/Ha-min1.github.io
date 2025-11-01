import { createConnection, Connection } from 'typeorm';
import { User } from './models/user';
import { config } from '../config';

let connection: Connection | null = null;

export const connectToDatabase = async (): Promise<Connection> => {
    if (connection) {
        return connection;
    }

    connection = await createConnection({
        type: 'mariadb',
        host: config.db.host,
        port: config.db.port,
        username: config.db.username,
        password: config.db.password,
        database: config.db.database,
        entities: [User],
        synchronize: true,
    });

    return connection;
};