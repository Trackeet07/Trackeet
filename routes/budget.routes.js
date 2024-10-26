// budgetRoutes.js
import express from 'express';
import { addBudget } from '../controllers/addBudget.js';

const router = express.Router();

// POST route to add a new budget
router.post('/add-budget', addBudget);

export default router;
