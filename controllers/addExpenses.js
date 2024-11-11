
import Expense from '../models/expensesModels.js';

// Controller function to add an expense
export const addExpense = async (req, res) => {
    try {
        const { expenseName, amount, category, date, link, description } = req.body;

        // Check for required fields
        if (!expenseName || !amount || !category || !date) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        // Get file path if an attachment is uploaded
        const attachment = req.file ? req.file.path : null;

        // Create a new expense
        const newExpense = new Expense({
            expenseName,
            amount,
            category,
            date,
            link,
            description,
            attachment
        });

        // Save to database
        const savedExpense = await newExpense.save();

        // Send success response
        res.status(201).json({
            message: "Expense added successfully.",
            data: savedExpense
        });

    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ message: "Failed to add expense.", error });
    }
};