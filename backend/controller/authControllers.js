import catchAsyncErrors from "../middlewares/catchAsyncErrors.js"
import User from "../models/users.js" 
import ErrorHandler from "../utils/errorHandler.js"

export const registerUser = catchAsyncErrors(async(req,res,next) => {
    const {name,email,password} = req.body
    const user = await User.create({name,email,password})
    /* 
        In summary, status code **201** signifies that a request has been fulfilled 
        and has resulted in the creation of one or more resources.
    */
   const token = user.getJwtToken();
    res.status(201).json({
        request: "Success",
        token
    })
})


export const loginUser = catchAsyncErrors(async(req,res,next) => {
    const {email,password} = req.body

    // Check if email & password has been sent.
    if(!email || !password) {
        return next(new ErrorHandler("Please enter email & password"), 400)
    }

    const user = await User.findOne({email}).select("+password")
    
    // Check if user exists.
    if(!user) {
        return next(new ErrorHandler("Invalid email & password"), 401)
    }
  
    const isPasswordMatched = user.comparePassword(String(password));

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid password"), 401)
    }

   const token = user.getJwtToken();
    res.status(200).json({
        request: "Success",
        message: "Login successful",
        token
    })
})