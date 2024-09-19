/* Since exporting Single Function, we need to destructure */
import Product from "../models/products.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "../middlewares/catchAsyncErrors.js";
import APIFilters from "../utils/apiFilters.js";


// Get All Products => /api/v1/products
/* 
    Do not miss await for Storage Operations
*/
export const getProducts = catchAsyncError(async(req, res,next) => {
    const resPerPage = 4
    /* 
        If request URL is of the form, ?keyword=Apple 
        Then you can fetch keyword with req.keyword = Apple
    */
    const apiFilters = new APIFilters(Product, req.query).search().filter() // Returns the Entire Object
    let products  = await apiFilters.query // DB Operation, Fetching variable from String
    const filteredProducts = products.length

    apiFilters.pagination(resPerPage) // Paginate our Result and Store in API Filter
    products = await apiFilters.query.clone()
    // const product = await Product.find()
    
    return res.status(200).json({resPerPage,filteredProducts, products});
})

// Create a New Product => /api/v1/admin/products
export const newProduct = catchAsyncError(async(req, res,next) => {
    //req.user is added via isAuthenticated Middleware
    req.body.user = req.user._id;

    const product = await Product.create(req.body)
    return res.status(200).json(product);
})

// Get single product details => /api/v1/products/:id
export const getProductDetails = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req?.params?.id)
    /* 
        Notice how we are sending back an Error
     */
    if(!product){
        console.log(`Calling the Error`)
       return next(new ErrorHandler("Product not found", 404))
    }
    
    return res.status(200).json({product})
})

// Update single product details => /api/v1/products/:id
export const updateProduct = catchAsyncError(async(req, res,next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new : true})
    if(!product){
       return res.status(404).json({error : "Product not found"})
    }    

    return res.status(200).json({product})
})

export const deleteProduct = catchAsyncError(async(req, res,next) => {
    const product = await Product.findById(req?.params?.id)
    /* 
        Notice how we are sending back an Error
     */
    if(!product){
       return res.status(404).json({error : "Product not found"})
    }

    await product.deleteOne();
    return res.status(200).json({message  : "Product deleted"})
})