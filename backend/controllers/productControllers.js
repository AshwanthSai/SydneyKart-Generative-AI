import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import APIFilters from "../utils/apiFilters.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";
import ErrorHandler from "../utils/errorHandler.js";

// Get all products   =>  /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res) => {
  // TODO fix pagination logic
  const resPerPage = 1000;
  const apiFilters = new APIFilters(Product, req.query).search().filters();

  let products = await apiFilters.query;
  let filteredProductsCount = products.length;

  apiFilters.pagination(resPerPage);
  products = await apiFilters.query.clone();


  return res.status(200).json({
    resPerPage,
    filteredProductsCount,
    products,
  });
});


// Create new Product   =>  /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res) => {
  req.body.user = req.user._id;

  const product = await Product.create(req.body);

  res.status(200).json({
    product,
  });
});

// Get single product details   =>  /api/v1/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {

  const product = await Product.findById(req?.params?.id).populate(
    "reviews.user" // Go one level deeper and retrieve this object
  );

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    product,
  });
});

// Get single product Admin   =>  /api/v1/Admin/products
export const getAdminProducts   = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find()
  if (!products) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    products,
  });
});

// Update product details   =>  /api/v1/products/:id
export const updateProduct = catchAsyncErrors(async (req, res) => {
  console.log(req?.params?.id)
  console.log(req?.body)

  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
  });

  console.log(product)
  res.status(200).json({
    product,
  });
});

// Delete product   =>  /api/v1/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Deleting image associated with product (Cloudinary)
  for(let i = 0; i < product?.images.length; i++) {
    await delete_file(product?.images[i]?.public_id)
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product Deleted",
  });
});

// Create/Update product review   =>  /api/v1/reviews
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req?.user?._id,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const isReviewed = product?.reviews?.find(
    (r) => r.user.toString() === req?.user?._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review?.user?.toString() === req?.user?._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get product reviews   =>  /api/v1/reviews?id=productId
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.query?.id)

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    reviews: product.reviews,
  });
});

// Delete product review   =>  /api/v1/admin/reviews
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product?.reviews?.filter(
    (review) => review._id.toString() !== req?.query?.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
    numOfReviews === 0
      ? 0
      : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        numOfReviews;

  product = await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, numOfReviews, ratings },
    { new: true }
  );

  res.status(200).json({
    success: true,
    product,
  });
});

// Can user review   =>  /api/v1/can_review
export const canUserReviewOrder = catchAsyncErrors(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
    "orderItems.product": req.query.productId,
  });

  if (orders.length === 0) {
    return res.status(200).json({ canReview: false });
  }

  res.status(200).json({
    canReview: true,
  });
});

// Upload product images   =>  /api/v1/admin/products/:id/upload_images
export const uploadProductImages = catchAsyncErrors(async (req, res) => {
  let product = await Product.findById(req?.params?.id)
  if(!product) {
    return new ErrorHandler("Product not found",404)
  }
  
  /* Fetch image Data URLS */
  const images = req?.body?.images
  /* Creating an image upload function */
  const uploadImages = async(image) => await upload_file(image, "SydneyKart/products")

  // Without Promise.all - Sequential
  /* 
    for (const image of images) {
      await uploadImages(image); // Each upload waits for previous
    } 
  */

  // With Promise.all - Parallel
  // All uploads start simultaneously
  const imageUrls = await Promise.all(images.map(uploadImages))

  /* Replacing Images */
  product?.images?.push(...imageUrls)
  await product?.save({ validateBeforeSave: false })

  return res.status(200).json({
    product
  })

});

// Delete product images   =>  /api/v1/admin/products/:id/delete_images
export const deleteProductImages = catchAsyncErrors(async (req, res) => {
  let product = await Product.findById(req?.params?.id)
  if(!product) {
    return new ErrorHandler("Product not found",404)
  }
  //Delete file from Cloudinary
  console.log(req?.body?.imgId)

  const isDeleted = await delete_file(req?.body?.imgId)

  if(!isDeleted) {
    return next(new ErrorHandler("Product Image found",404))
  }

  if(isDeleted){
    product.images = product.images.filter(image => image.public_id !== req?.body?.imgId) 
    await product?.save({ validateBeforeSave: false })
  }
  
  return res.status(200).json({
    product
  })
});


