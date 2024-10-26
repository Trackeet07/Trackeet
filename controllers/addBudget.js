// budgetController.js
import Budget from '../models/budgetModels.js';

// Controller function to add a budget
export const addBudget = async (req, res) => {
    try {
        const { budgetName, duration, totalBudget } = req.body;

        // Check for required fields
        if (!budgetName || !duration || !totalBudget) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        // Create a new budget
        const newBudget = new Budget({
            budgetName,
            duration,
            totalBudget
        });

        // Save to database
        const savedBudget = await newBudget.save();

        // Send success response
        res.status(201).json({
            message: "Budget added successfully.",
            data: savedBudget
        });

    } catch (error) {
        console.error("Error adding budget:", error);
        res.status(500).json({ message: "Failed to add budget.", error });
    }
};
