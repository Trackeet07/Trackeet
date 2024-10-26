// budgetModel.js
import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
    budgetName: {
        type: String,
        required: true
    },
    duration: {
        type: String, // e.g., "monthly", "yearly"
        required: true
    },
    totalBudget: {
        type: Number,
        required: true
    }
}, {
    versionKey: false
});

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
