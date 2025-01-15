import { expenseSchema } from '../validation/validation.js';
import Expense from '../models/expensesModels.js';
import catchAsync from '../middleware/catchAsync.js';
import httpStatus from 'http-status';
// Controller function to add an expense
export const addExpense = async (req, res) => {
    try {

    } catch(error) {
        console.log("EXPENSES ERROR", error.message)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while adding expense."
        });
    }
        const { error, value } = req.value.body

        if(error) {
            console.log("Errors", error)
            return res.status(httpStatus.NOT_FOUND).json({
                message: error.message
            })
        }
        // Get file path if an attachment is uploaded
        const attachment = req.file ? req.file.path : null;

        req.value.body= { ...req.value.body, attachment: attachment }
        // Create a new expense
        const newExpense = await Expense.create(req.value.body);

        // Save to database 
        const savedExpense = await newExpense.save();

        // Send success response
        res.status(201).json({
            message: "Expense added successfully.",
            data: savedExpense
        });
    }