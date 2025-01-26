import catchAsyncErrors from "../middlewares/catchAsyncErrors.js"
import User from "../models/users.js" 
import ErrorHandler from "../utils/errorHandler.js"
import { sendToken } from "../utils/sendCookie.js"
import { getResetPasswordTemplate } from "../utils/emailTemplate.js"
import { sendEmail } from "../utils/sendEmail.js"
import crypto from "crypto";

// {{DOMAIN}}/api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    // 1. Track initial state
    const debugState = {
        initial: res._headersSent,
        afterQuery: null,
        afterCreate: null,
        beforeResponse: null
    };

    // 2. User existence check
    const existingUser = await User.exists({ email: req.body.email });
    debugState.afterQuery = res._headerSent;

    if (existingUser) {
        return next(new ErrorHandler("User already exists", 409));
    }

    // 3. User creation
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    debugState.afterCreate = res._headerSent;

    // 4. Send response
    debugState.beforeResponse = res._headerSent;
    console.table(debugState);

    return sendToken(user, 201, res);
});

// {{DOMAIN}}/api/v1/login
export const loginUser = catchAsyncErrors(async (req,res,next) => {
    const {email,password} = req.body
    
    // Check if email & password has been sent.
    if(!email || !password) {
        return next(new ErrorHandler("Please enter email & password"), 400)
    }
    console.log("res-here 1", res._headerSent)
    const user = await User.findOne({email}).select("+password")
    console.log("res-here 2", res._headerSent)
    // Check if user exists.
    if(!user) {
        return next(new ErrorHandler("Invalid email & password"), 401)
    }
  
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid password"), 401)
    }

   // Means to pass data
    res.locals.data = {
        request: "Success",
        message: "Login successful",
    }
   sendToken(user,200,res)
})

// {{DOMAIN}}/api/v1/logout
export const logoutUser = catchAsyncErrors(async(req,res,next) => {
    res.cookie("token", null, {
        expires : new Date(Date.now()),
        httpOnly :true
    })
    return res.status(200).json({
        message : "Success"
    })
})


// Forgot Password - {{DOMAIN}}/api/v1/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    // Check if User Exists
    if (!user) {
        return next(new ErrorHandler("No user found with this email", 404));
    }

    // Generate Token + Save in Document
    const resetToken = user.getResetPasswordToken();
    await user.save(); // Make sure this saves the token and expiration

    // Redirect Link within Email Template
    const resetUrl = `${process.env.DOMAIN}/api/v1/password/reset/${resetToken}`;
    // Returns HTML as a JS String.
    const message = getResetPasswordTemplate(user?.name, resetUrl);

    // Send Email
    try {
        let options = {
            email: user.email,
            subject: "Sydney Kart Password Recovery",
            message,
        };

        // Remember any form of Network write or db write is Async  
        await sendEmail(options);

        return res.status(200).json({
            message: `Email sent to ${user.email}`,
        });
    } catch (error) {
        // Clear reset token and expiration on error
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        console.log(`Here`)
        // Return the error through next
        return next(new ErrorHandler(error?.message, 500));
    }
});


// Reset Password - {{DOMAIN}}/api/v1/password/reset/:resetToken`
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Check if Token is valid
    const token = req.params.resetToken;
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: hash,
        resetPasswordExpire: {$gt : Date.now()},
    })
    if(!user) {
        return next(new ErrorHandler("The reset token is invalid or has expired. Please request a new token.", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match. Please re-enter your passwords.", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.locals.data = "Password reset"
    sendToken(user,200,res)
});


// Get User Details - {{DOMAIN}}/api/v1/me`
// This is a Protected Route
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id)
    return res.status(200).json({
        user
    })
})


// Update User Password - {{DOMAIN}}/api/v1/password/update`
// This is a Protected Route
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password")
    // Verifying if, supplied password is same as password in DB
    // Remember, login state is managed via JWT
    const isPasswordMatch = await user.comparePassword(req.body.oldPassword)
    if(!isPasswordMatch){
        return next(new ErrorHandler("Old password is Incorrect",400))
    }
    user.password = req.body.password;
    await user.save()

    return res.status(200).json({
        message : "Password updated successfully"
    })
})



// Update User Details - {{DOMAIN}}/api/v1/me/update`
// This is a Protected Route
// Update User Details - Protected Route
export const updateDetails = catchAsyncErrors(async (req, res, next) => {
    const newDetails = {
        name: req.body.name,
        email: req.body.email,
    };

    // Update user details in the database
    const user = await User.findByIdAndUpdate(req.user._id, newDetails, {
        new: true, // This option returns the updated document
        runValidators: true, // This option ensures that the update respects the model's validation rules
    });

    /*
        If your application benefits from having the updated
        document returned and it does not pose any security or performance issues,
        then it is a good practice to send it back.
    */
    return res.status(200).json({
        message: "User details successfully updated",
        user, // Optionally return the updated user details
    });
});


// Get all Users - {{DOMAIN}}/api/v1/admin/users
// This is a Protected, Authorized Admin Route
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    if(!users){
        return next(new ErrorHandler("No users found"))
    }

    return res.status(200).json({
        users
    })
});


// Get specific user details - {{DOMAIN}}/api/v1/admin/users/:id
// This is a Protected, Authorized Admin Route
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const userId = req.params.id
    const user = await User.findById(userId)

    if(!user){
        /* Errors have to be actionable */
        return next(new ErrorHandler(`User not found with ${req.params.id}`, 404))
    }

    return res.status(200).json({
        user
    })
});


// Update Email, Name and Role of a User
// {{DOMAIN}}/api/v1/admin/users/:id
// This is a Protected, Authorized Admin Route
export const updateUser = catchAsyncErrors(async (req, res, next) => {
    // Ensure that all the data is passed to the backend.
    const newDetails = {
        name : req.body?.name,
        email : req.body?.email,
        role: req.body?.role
    }

    const userId = req.params.id

    // New: True returns the updated document.
    // const user = User.findOneAndUpdate({_id : userId}, newDetails)
    const user = await User.findByIdAndUpdate(userId, newDetails,
        { new: true}
    )
    
    return res.status(200).json({
       user : {
        name : user.name,
        email : user.email,
        role: user.role
       }
    })
});


// Delete a User - {{DOMAIN}}/api/v1/admin/users/:id
// This is a Protected, Authorized Admin Route
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    const userId = req.params.id

    const user = await User.findById(userId)

    if(!user){
        /* Errors have to be actionable */
        return next(new ErrorHandler(`User not found with ${req.params.id}`, 404))
    }

    //! Remove user avatar from Cloudinary 
    await user.deleteOne()

    return res.status(200).json({
        message : "User deleted successfully",
    })
});


export const debugResponse = (req, res, next) => {
    const steps = [];
    const originalMethods = {
        end: res.end.bind(res)
    };

    // Properly bound end method
    res.end = function(...args) {
        try {
            steps.push({
                method: 'end',
                headersSent: this._headersSent,
                timestamp: Date.now(),
                stack: new Error().stack
            });
            return originalMethods.end.apply(this, args);
        } catch (error) {
            console.error('Error in end method:', error);
            return originalMethods.end.apply(this, args);
        }
    }.bind(res);

    // Log on finish with error handling
    res.on('finish', () => {
        console.table(steps);
    });

    next();
};