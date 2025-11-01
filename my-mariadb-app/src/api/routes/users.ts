import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../../db/models/user';

const router = Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error });
    }
});

// Create a new user
router.post('/', async (req, res) => {
    const newUser = req.body;
    try {
        const createdUser = await createUser(newUser);
        res.status(201).json(createdUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    try {
        const user = await updateUser(id, updatedUser);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteUser(id);
        if (result) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

export default router;