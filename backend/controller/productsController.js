/* Since exporting Single Function, we need to destructure */
import Product from "../models/products.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "../middlewares/catchAsyncErrors.js";
import APIFilters from "../utils/apiFilters.js";

var testing = false;
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

// Delete single product details => /api/v1/products/:id
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


// Add Product Review  => /api/v1/reviews
export const createProductReview = catchAsyncError(async(req,res,next) => {
    /* 
        Check if Reviews Exist
            If true then update
            If false then create
        Calculate new overall rating.
        Return status 200 
    */

   const {rating, comment, productId} = req.body

   const review = {
        user : req.user._id,
        rating: Number(rating),
        comment,
   }

   const product = await Product.findById(productId)

   if(!product) {
    return next(new ErrorHandler(`Product ${productId} is not found`, 404))
   }

   const isReviewed = product.reviews.find((review) => {
    // Because Ids are of Mongoose Type
    return review.user.toString() == req.user._id.toString()
   })

   if(testing) {
    product.reviews = []
    await product.save()  
    /* console.clear()
    console.log(product.reviews)  */
    return res.status(200).json({message : "Reviews Cleared"})
   }

   if(isReviewed){
        // Find the review within the array and update.
        product.reviews.forEach((r) => {
            console.log("Im here")
            // Because Ids are of Mongoose Type
            console.log(r.user.toString())
            console.log(req.user._id.toString())
            if(r.user.toString() == req.user._id.toString()) {
                r.rating = review.rating,
                r.comment = review.comment
            }
        }) 
    } else {
        // Create a new Review.
        // The push here is a mongoose method.
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
   }

   console.log(product.reviews)
   const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0)
   product.ratings = totalRating / product.reviews.length;

   /* We have not linked the product review  to a User */
   await product.save({validateBeforeSave: false})

   /* Response code 200 for updating */
   res.status(isReviewed ? 201 : 200).json({
    success : true
   })
})

// Get all reviews of a Particular Product  => /api/v1/reviews?id="productId"
export const getProductReviews = catchAsyncError(async(req,res,next) => {
   const productId = req.query.id
   const product = await Product.findById(productId)
   
   if(!product){
    return next(new ErrorHandler(`Product ${product} does not exist`, 404))
   }

   res.status(200).json({
    success:"true",
    reviews : product.reviews
   })
})

// Delete review of a Particular Product  => /api/v1/reviews
export const deleteProductReview = catchAsyncError(async(req,res,next) => {
    const productId = req.query.id
    const product = await Product.findById(productId);
    
    if(!product){
        return next(new ErrorHandler(`Product ${productId} not found`, 404))
    }

    const modifiedReviews = product.reviews.filter((review) => {
        return review.user.toString() != req.user._id
    })
    product.numOfReviews--;
    product.ratings = modifiedReviews.length > 0 ? (modifiedReviews.reduce((acc, item) => item.rating + acc, 0)) / modifiedReviews.length : 0
    product.reviews = modifiedReviews

    await product.save()
    res.status(200).json({
        success : "true"
    })
})
 
