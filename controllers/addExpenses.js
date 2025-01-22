import { expenseSchema } from '../validation/validation.js';
import Expense from '../models/expensesModels.js';
import catchAsync from '../middleware/catchAsync.js';
import httpStatus from 'http-status';
import User from '../models/userModels.js';
import mongoose from "mongoose";
// Controller function to add an expense
export const addExpense = async (req, res) => {


    try {
        let validatedExpenseData = req.value.body

        // Get file path if an attachment is uploaded
        const attachment = req.file ? req.file.path : null;

        validatedExpenseData = { ...validatedExpenseData, author: req.user.id, attachment: attachment }
        // Create a new expense
        const newExpense = await Expense.create(validatedExpenseData);

        // Save to database 
        const savedExpense = await newExpense.save();

        // Send success response
        res.status(201).json({
            message: "Expense added successfully.",
            data: savedExpense
        });
    }catch(error) {
        console.log("EXPENSES ERROR", error.message)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while adding expense."
        });
    }
}
        

    export const getAllExpenses = async (req, res, next) => {
        try {
            const userID = req.user._id
            console.log("USER ID:", userID)
            if (!req.user || !userID || !mongoose.Types.ObjectId.isValid(req.user._id)) {
                return res.status(400).json({
                  status: 'error',
                  message: 'Invalid user ID',
                });
                console.log("EERROR:", error)
              }
              const findUser = await User.findById(userID)
              console.log("found User", findUser)
              if (!findUser) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
              }
              const expenses = await Expense.find({ author: userID })
              if (!expenses.length) {
                return res.status(404).json({ status: 'error', message: 'Expense not found' });
              }
              res.status(200).json({
                status: 'success',
                data: {
                expenses
                }
                });

        }catch(error) {
            console.log("An Error Occured", error.message)
            return res.status(500).json({message: "An Internal Error Occured" })
        }
    }

    export const getExpense = catchAsync(async (req, res, next) => {
        const expense = await Expense.findById(req.params.id);
        if(!expense) {
            console.log("expense>>", expense)
        return  res.status(404).json({ message: "No Expense found with that ID"})
        }
            res.status(httpStatus.OK).json({
                status: "Success",
                data: {
                    expense
                }
            })
    }
    )
