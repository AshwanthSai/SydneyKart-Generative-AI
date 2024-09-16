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

    if(process.env.NODE_ENV==="DEVELOPMENT") {
      return res.status(error.statusCode).json({
            message : error.message,
            error : err,
            stack : err.stack
        })
    } 
    // Process is Global, env is the field we are interested in.
    if(process.env.NODE_ENV==="PRODUCTION")  {
      return res.status(error.statusCode).json({
            message : error.message,
        })
    }
}


