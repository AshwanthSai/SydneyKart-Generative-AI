import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/orders.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create a COD Order -> //{{DOMAIN}}/api/v1/orders/new
export const createOrder = catchAsyncErrors(async(req,res,next) => {
    const {
        shippingInfo,
        /* 
            user, This is fetched from req, because this is a protected route.
        */
        orderItems,
        paymentMethod,
        paymentInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
    } = req.body;

    /* 
    If you do not await, you get a success response
    with an empty object
    */
    const order = await Order.create({
        shippingInfo,
        /* 
            user, This is fetched from req, because this is a protected route.
         */
        orderItems,
        paymentMethod,
        paymentInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        user: req.user._id
         // We only care of the User ID and not the entire object
    })

    res.status(201).json({
        success: true,
        order
    })
})

// Fetch single Order -> //{{DOMAIN}}/api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async(req,res,next) => {
    const orderId = req.params.id
    /* The below will selectively populate user fields*/
    const order = await Order.findById(orderId).populate("user", "name email")

    /* The below will populate entire user document */
    // const order = await Order.findById(orderId).populate("user")
    if(!order) {
        return next(new ErrorHandler(`Order ${orderId} is invalid`, 404))
    }

    res.status(200).json({
        order
    })
})

// Fetch all my orders -> //{{DOMAIN}}/api/v1/me/orders
export const myOrders = catchAsyncErrors(async(req,res,next) => {
    const userId = req.user._id
    //Returns an Array
    const orders = await Order.find({user:userId})
    if(orders.length == 0) {
        return next(new ErrorHandler(`No orders found for user ${userId}`, 404))
    }
    
    /* When fetching items, return a Success or false statement */
    res.status(200).json({
        success: true, // Optional: Indicate success
        orders
    })
})