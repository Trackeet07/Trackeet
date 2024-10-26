import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    expenseName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    link: {
        type: String
    },
    description: {
        type: String
    },
    attachment: {
        type: String
    }
}, {
    versionKey: false
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
