import ErrorHandler from "../utils/errorHandler.js";


// Middleware for handling errors
export const errorMiddleware = (err, req, res, next) => {
    let error = {
        statusCode : err?.statusCode || 500,
        message : err?.message || "Internal Server Error",
    }
    // For Handling Mongoose ID Error 
    if(err.name == "CastError") {
        // 404 == Invalid ID
        // Pass Error to next middleware
        const message = `Product not found, Invalid : ${err.path}`
        error = new ErrorHandler(message, 404)
    }

    if(err.name == "ValidationError") {
        // 404 == Invalid ID
        // Pass Error to next middleware
        const message = Object.values(err.errors).map(item => item.message)
        console.error(message)
        error = new ErrorHandler(message, 400)
    }
    
    // Duplicate entry found in db, when there is a Unique Constraint
    if(err?.code === 11000) {
        const resource = Object.keys(err?.errorResponse?.keyPattern)
        req.error = new ErrorHandler(`Duplicate ${resource}`, 409)
        return next();
    } 

    // Expired JWT Token
    if(err.message == "TokenExpiredError") {
        error = new ErrorHandler(`JSON Web Token is expired`, 404)
    } 

    // Wrong JWT Token
     if(err.message == "JsonWebTokenError") {
        error = new ErrorHandler(`JSON Web Token is invalid`, 404)
    } 
    
    if(process.env.NODE_ENV==="DEVELOPMENT") {
      return res.status(error.statusCode).json({
            message : error.message,
            error : err,
            stack : err.stack
        })
    } 

    // If in production, send back a JSON response.
    if(process.env.NODE_ENV==="PRODUCTION")  {
      return res.status(error.statusCode).json({
            message : error.message,
        })
    }

    // Default case for any other environment
    return res.status(error.statusCode).json({
        message: error.message,
        error: err,
        stack: err.stack
    });
}


