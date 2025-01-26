/* 
    Normal error class does not let you store the Status Code.
    So We use our own customized Error Class.
*/

class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;

        /* 
            This line captures the stack trace for the current
            instance of  ErrorHandler. The second argument specifies 
            the constructor that should be excluded from the stack 
            trace, which is typically the class itself. 

            Essentially, used to send back the line in which the code broke.
        */
        Error.captureStackTrace(this, this.constructor);
    }

}

export default ErrorHandler;