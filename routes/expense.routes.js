
import express from 'express';
import { addExpense } from '../controllers/addExpenses.js';

import upload from '../public/multer.js';

const router = express.Router();


router.post('/create', upload.single('attachment'), addExpense);

export default router;
