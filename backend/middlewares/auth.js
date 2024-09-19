import User from "../models/users.js";
import ErrorHandler from "../utils/errorHandler.js"
import jwt from "jsonwebtoken";

export const isAuthenticatedUser = async(req,res,next) => {
    const {token} = req.cookies

    //Unauthorized
    if(!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401)) 
    } 

    // Verifying Token and appending User ID to Req.
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    // Append User Object to the req.
    req.user = await User.findById(decodedData.id)
    next();
}

// ...roles is the rest parameter. Use when you do not know the number of variables being passed.
// 403 -> Forbidden Request
export const authorizeRoles = (...roles) => { 
   // Step 1: Higher-order function
   return (req, res, next) => { // Step 2: Middleware function
    // Check if the user's role is included in the allowed roles
    console.log(req.user)
        if (!roles.includes(req.user.role)) { // Step 3: Role validation
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`, 403));
        }
        next(); // Step 4: Proceed to the next middleware or route handler
    };
};