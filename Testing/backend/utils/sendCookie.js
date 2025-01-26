/* 
    Cookie is generic, What kind of cookie ?
    We are sending a token cookie here.
*/

export const sendToken = async (user, statusCode, res) => {
    // Creating Options for JWT
    // Create JWT Token
    const token = await user.getJwtToken();
    // Options for cookie
    const options = {
        expiry: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: "None"
    };


    res.cookie("token", token, options)
    return res.status(200).json({
        success: true,
        user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }
    })
}
