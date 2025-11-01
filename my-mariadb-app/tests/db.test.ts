import { createConnection } from 'typeorm';
import { User } from '../src/db/models/user';

describe('Database Tests', () => {
    let connection;

    beforeAll(async () => {
        connection = await createConnection({
            type: 'mariadb',
            host: 'localhost',
            port: 3306,
            username: 'test',
            password: 'test',
            database: 'test_db',
            entities: [User],
            synchronize: true,
        });
    });

    afterAll(async () => {
        await connection.close();
    });

    it('should create a new user', async () => {
        const user = new User();
        user.name = 'John Doe';
        user.email = 'john.doe@example.com';

        const savedUser = await connection.manager.save(user);
        expect(savedUser).toHaveProperty('id');
        expect(savedUser.name).toBe(user.name);
        expect(savedUser.email).toBe(user.email);
    });

    it('should retrieve a user by email', async () => {
        const user = await connection.manager.findOne(User, { where: { email: 'john.doe@example.com' } });
        expect(user).toBeDefined();
        expect(user.name).toBe('John Doe');
    });

    it('should delete a user', async () => {
        const user = await connection.manager.findOne(User, { where: { email: 'john.doe@example.com' } });
        await connection.manager.remove(user);
        
        const deletedUser = await connection.manager.findOne(User, { where: { email: 'john.doe@example.com' } });
        expect(deletedUser).toBeNull();
    });
});