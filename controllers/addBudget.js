// budgetController.js
import Budget from '../models/budgetModels.js';
import { budgetSchema } from '../validation/validation.js';
import catchAsync from '../middleware/catchAsync.js';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';


// Controller function to add a budget
export const createBudget = catchAsync (async (req, res) => {
        const { error, value } = budgetSchema.validate(req.body, {abortEarly: false})
        if(error) {
            console.log("Errors", error)
        return res.status(httpStatus.NOT_FOUND).json({
            message: error.message
        })
    }
    req.body = { ...value, user:req.user._id}
        // Create a new budget
        const newBudget = await Budget.create(req.body);
        // Save to database
        const savedBudget = await newBudget.save();

        // Send success response
        res.status(201).json({
            message: "Budget added successfully.",
            data: savedBudget
        });
});


//GEt Budget
export const getBudget = catchAsync(async (req, res, next) => {
    const budget = await Budget.findById(req.params.id);
    if(!budget) {
        console.log("BUDGET>>", budget)
    return  res.status(httpStatus.UNAUTHORIZED).json({ message: "No budget found with that ID"})
    }
        res.status(httpStatus.OK).json({
            status: "Success",
            data: {
                budget
            }
        })
}
)

// Update budget
export const updateBudget = catchAsync(async(req, res, next) => {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if(!budget) {
        return  res.status(httpStatus.NOT_FOUND).json({ message: "No Budget found with that id"})
        }
    res.status(httpStatus.OK).json({
        status: "Success",
        message: "Budget updated",
        data: {
            budget
        }
    })

})

//DELETE BUDGET
export const deleteBudget = catchAsync(async (req, res, next)=> {
    const budget = await Budget.findByIdAndDelete(req.params.id)  
    if(!budget) {
        return  res.status(httpStatus.NOT_FOUND).json({messahe: "No Budget found with that ID"})
        }
        res.status(httpStatus.NO_CONTENT).json({
            status: "success",
            data: null
        })
})

//GET  ALL BUDGET
export const getAllBudget = catchAsync(async (req, res, next) => {
    // Get page and limit from query parameters, default to page 1 and limit 10
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 3) || 3;
    const skip = (page - 1) * limit;

    // Fetch total number of books
    const numBudgets = await Budget.countDocuments();

    // Check if the requested page exists
    if (skip >= numBudgets) {
        return res.status(404).json({
            status: 'fail',
            message: 'This page does not exist'
        });
    }
    // Fetch books with pagination
    const budgets = await Budget.find().skip(skip).limit(limit);

    // Respond with paginated budgets
    res.status(200).json({
        status: 'success',
        results: budgets.length,
        data: {
            budgets,
            totalPages: Math.ceil(numBudgets / limit),
            currentPage: page
        }
    });
});
    
