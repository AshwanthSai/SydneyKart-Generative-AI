// Create token and save in the cookie
export default (user, statusCode, res) => {
  // Create JWT Token
  // Create JWT Token
  const token = user.getJwtToken();

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // Capital N, Time spend on fixing bug - 1hr
    // You can only set samesite to None in HTTPS Connection
    // This is not possible in Development, So we use Lax
    sameSite: 'Lax',
    // Only send over HTTPS, When in production
    secure: process.env.NODE_ENV === 'production'
  }
  
  return res.status(statusCode).cookie("token", token, options).json({
    token
  });
};
