// budgetRoutes.js
import express from 'express';
import { createBudget, getBudget, updateBudget, deleteBudget, getAllBudget } from '../controllers/addBudget.js';
import { protect } from '../controllers/authControllers.js';

const router = express.Router();
router.use(protect);
// POST route to add a new budget
router.post('/create',  createBudget);
router.get('/getBudget/:id',  getBudget);
router.patch('/updateBudget/:id',  updateBudget);
router.delete('/deleteBudget/:id',  deleteBudget);
router.get('/getAll',  getAllBudget);


export default router;
