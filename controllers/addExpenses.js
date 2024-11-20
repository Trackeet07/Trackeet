import { expenseSchema } from '../validation/validation.js';
import Expense from '../models/expensesModels.js';
import catchAsync from '../middleware/catchAsync.js';
import httpStatus from 'http-status';
// Controller function to add an expense
export const addExpense = catchAsync(async (req, res) => {
        const { error, value } = expenseSchema.validate(req.body, {abortEarly: false})

        if(error) {
            console.log("Errors", error)
            return res.status(httpStatus.NOT_FOUND).json({
                message: error.message
            })
        }
        // Get file path if an attachment is uploaded
        const attachment = req.file ? req.file.path : null;

        req.body= { ...req.body, attachment: attachment }
        // Create a new expense
        const newExpense = await Expense.create(req.body);

        // Save to database 
        const savedExpense = await newExpense.save();

        // Send success response
        res.status(201).json({
            message: "Expense added successfully.",
            data: savedExpense
        });
});