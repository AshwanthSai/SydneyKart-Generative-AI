import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/orders.js";
import Product from "../models/products.js";
import ErrorHandler from "../utils/errorHandler.js";
import mongoose from "mongoose"

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
    When order is created, we keep the status as Processing.
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

// Get All Orders - //{{DOMAIN}}/api/v1/admin/orders
// This is a Protected Admin Only Route. 
export const getAllOrders = catchAsyncErrors(async(req,res,next) => {
    const orders = await Order.find();

    if(!orders){
        return next(new ErrorHandler("No Orders found", 404))
    }

    res.status(200).json(orders)
})

// Get All Orders - //{{DOMAIN}}/api/v1/admin/orders
// This is a Protected Admin Only Route. 
export const updateOrderDetails = catchAsyncErrors(async(req,res,next) => {
    const orders = Order.find();

    if(!orders){
        return next(new ErrorHandler("No Orders found", 404))
    }

    res.status(200).json(orders)
})


// Update Order Status - //{{DOMAIN}}/api/v1/admin/orders/:id
// This is a Protected Admin Only Route. 
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
    // const session = await mongoose.startSession();

    // Rolling a Transaction to prevent Race Condition
    // session.startTransaction();

    try {
        const orderId = req.params.id;
        // const order = await Order.findById(orderId).session(session);
        const order = await Order.findById(orderId);
        if (!order) {
            return next(new ErrorHandler(`Order ${orderId} not found`, 404));
        }

        if (order.orderStatus === "Delivered") {
            return next(new ErrorHandler("Cannot change order status", 403));
        }

        // Changing Quantity when Item is Shipped.
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product.toString());
            // const product = await Product.findById(item.product.toString()).session(session);
            if (!product) {
                return next(new ErrorHandler(`Product with ID ${item.product} not found`, 404));
            }
            product.stock = product.stock - item.quantity;
            // await product.save({ session }); // Save with the transaction session
            await product.save(); // Save with the transaction session
        }

        const newStatus = req.body.orderStatus;
        order.orderStatus = newStatus;
        // await order.save({ session }); // Save with the transaction session
        await order.save(); // Save with the transaction session

        // await session.commitTransaction(); // Commit the transaction
        res.status(200).json({ success: true, order });
    } catch (error) {
        // await session.abortTransaction(); // Abort the transaction on error
        return next(error);
    } finally {
        // session.endSession(); // End the session
    }
});


// Update Order Status - //{{DOMAIN}}/api/v1/admin/orders/:id
// This is a Protected Admin Only Route. 
export const deleteOrder = catchAsyncErrors(async(req,res,next) => {
    const orderId = req.params.id; 
    const order = await Order.findById(orderId);

    if(!order) {
        return next(new ErrorHandler(`Order ${orderId} not found`, 404))
    }

    await order.deleteOne()

    res.status(200).json({
        success : true,
        message : `Order ${orderId} has not been deleted`
    })
})
