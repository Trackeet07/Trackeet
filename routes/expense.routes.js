
import express from 'express';
import { addExpense, getAllExpenses } from '../controllers/addExpenses.js';
import { validateRequest,  expenseSchema,  } from '../validation/validation.js';
import upload from '../public/multer.js';
import isAuthenticated from '../middleware/auth.js';


const router = express.Router();
router.use(isAuthenticated);

router.post('/create', upload.single('attachment'), validateRequest(expenseSchema), addExpense);
router.get('/all', getAllExpenses);

export default router;
