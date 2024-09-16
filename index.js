const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./database/db'); 
const userRouter = require('./routes/user.routes');


const app = express();
app.use(express.json());
app.use(morgan('dev'));
dotenv.config();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to Trackeet!')
});

app.use('/api/v1/user', userRouter);

app.listen(port, async () =>{
    try {
        await connectDB(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
        console.log(`Server is listening on ${port}`);
    } catch (error) {
        console.log("Error connecting to MongoDB: " + error.message);
    }
})