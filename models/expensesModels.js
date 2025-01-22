import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    expenseName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to the User 
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
