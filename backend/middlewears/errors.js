export const errorMiddleware = (err, req, res, next) => {
    let error = {
        statusCode : err?.statusCode || 500,
        message : err?.message || "Internal Server Error",
    }
    
    console.error(err);

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


