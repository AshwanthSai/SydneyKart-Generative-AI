class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Provides the exact location of the error
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
