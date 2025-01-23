// budgetController.js
import Budget from '../models/budgetModels.js';
import catchAsync from '../middleware/catchAsync.js';
import httpStatus from 'http-status';
import mongoose from "mongoose";
import User from '../models/userModels.js';


// Controller function to add a budget
export const createBudget = async (req, res) => {

    try {
        let validatedData = req.value.body
   
    validatedData = { ...validatedData, user:req.user._id}
        // Create a new budget
        const newBudget = await Budget.create(validatedData);
        // Save to database
        const savedBudget = await newBudget.save();

        // Send success response
        res.status(201).json({
            message: "Budget added successfully.",
            data: savedBudget
        });
    } catch(error) {
        console.log("BUDGET ERROR:", error.message)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while adding expense."
          });
    }
       
};


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
    const limit = parseInt(req.query.limit, 100) || 100;
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
    


export const getAllBudgetUser = async (req, res, next) => {
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
          let query = { author: findUser._id }
          const page = parseInt(req.query.page, 10) || 1;
          const limit = parseInt(req.query.limit, 100) || 100;
          const skip = (page - 1) * limit;
      
          // Fetch total number of books
          const numBudgets = await Budget.countDocuments(query);
      
          // Check if the requested page exists
          if (skip >= numBudgets) {
              return res.status(404).json({
                  status: 'fail',
                  message: 'This page does not exist'
              });
          }
          // Fetch books with pagination
          const budgets = await Budget.find(query).skip(skip).limit(limit);
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

    }catch(error) {
        console.log("An Error Occured", error.message)
        return res.status(500).json({message: "An Internal Error Occured" })
    }
}