
import express from 'express';
import { addExpense } from '../controllers/addExpenses.js';
import { validateRequest,  expenseSchema,  } from '../validation/validation.js';
import upload from '../public/multer.js';

const router = express.Router();


router.post('/create', validateRequest(expenseSchema), upload.single('attachment'), addExpense);

export default router;
