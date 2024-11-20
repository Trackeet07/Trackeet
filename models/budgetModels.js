// budgetModel.js
import mongoose from 'mongoose';
import User from "./userModels.js"

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Budget must belong to a User!"]
      },

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
    },
    createdAt: { 
        type: Date,
        default: Date.now(),
        select: false
      },
}, {
    versionKey: false
});

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
