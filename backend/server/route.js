import express from 'express';
import {
  getUsers,
  addUser,
  getUserById,
  editUser,
  deleteUser,
  getActivities,
  getDashboardStats,
} from '../controller/user-controller.js';
import { validateUser } from '../middleware/validator.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/add', validateUser, addUser);
router.get('/activities', getActivities);
router.get('/dashboard/stats', getDashboardStats);
router.get('/:id', getUserById);
router.put('/:id', validateUser, editUser);
router.delete('/:id', deleteUser);

export default router;
