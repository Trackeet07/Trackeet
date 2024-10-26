
import express from 'express';
import { addExpense } from '../controllers/addExpenses.js';

const router = express.Router();


router.post('/add-expense', addExpense);

export default router;
