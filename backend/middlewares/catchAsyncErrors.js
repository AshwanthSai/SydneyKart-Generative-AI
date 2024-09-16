/* 
    We import this unnamed function as catchAsyncError,
    wrap functions with it, run it.
    If rejected promise, pass to Error Middleware 
*/

export default (controllerFunction) => (req,res,next) => {
    Promise.resolve(controllerFunction(req,res,next)).catch(next);
}

