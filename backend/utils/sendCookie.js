/* 
    Cookie is generic, What kind of cookie ?
    We are sending a token cookie here.
*/

export const sendToken = (user, statusCode, res) => {
    // Creating Options for JWT
    const options = {
        /* 
            7 days * 24 hours/day * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second 
        */
        expiry : Date.now() + process.env.COOKIE_EXPIRE *  24 * 60 * 60 * 1000,
        // httpOnly : true, 
        secure: process.env.NODE_ENV === 'production' // Ensures the cookie is only sent over HTTPS in production
    }
    // Create a JWT Token
    const token  = user.getJwtToken();
    const message = res.locals.data;
    res.status(statusCode).cookie("token", token, options).json({
        token,
        message
    })
}