import User from "../models/users.js";
import ErrorHandler from "../utils/errorHandler.js"
import jwt from "jsonwebtoken";

/* 
    Middleware = Auxillary Controllers  
*/

export const isAuthenticatedUser = async(req,res,next) => {
    //If logged in, the cookie will have JWT.
    const {token} = req.cookies

    //Unauthorized
    if(!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401)) 
    } 

    // Verifying Token and appending User ID to Req.
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    // Append User Object to the req.
    req.user = await User.findById(decodedData.id)

    if(!req.user) {
        return next(new ErrorHandler("Invalid Credentials", 401)) 
    } 
    next();
}

/* 
    Basically Currying
    A simple curried function to add numbers
    const add = (a) => (b) => a + b;
    Using the curried function
    const addFive = add(5); // Returns a function that adds 5 to its argument
    const result = addFive(10); // Now we add 10 to 5
*/
// ...roles is the rest parameter. Use when you do not know the number of variables being passed.
// 403 -> Forbidden Request
export const authorizeRoles = (...roles) => { 
   // Step 1: Higher-order function
   return (req, res, next) => { // Step 2: Middleware function
    // Check if the user's role is included in the allowed roles
    // console.log(req.user)
        if (!roles.includes(req.user.role)) { // Step 3: Role validation
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`, 403));
        }
        next(); // Step 4: Proceed to the next middleware or route handler
    };
};