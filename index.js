import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import morgan from 'morgan';
import connectDB from './database/db.js'; 
import userRouter from './routes/user.routes.js';
import expenseRouter from './routes/expense.routes.js';
import budgetRouter from './routes/budget.routes.js';


const app = express();
app.use(express.json());
app.use(morgan('dev'));
config();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to Trackeet!')
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/expense', expenseRouter);
app.use('/api/v1/budget', budgetRouter);

app.listen(port, async () =>{
    try {
        await connectDB(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
        console.log(`Server is listening on ${port}`);
    } catch (error) {
        console.log("Error connecting to MongoDB: " + error.message);
    }
})