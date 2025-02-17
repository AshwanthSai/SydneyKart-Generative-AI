import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create new Order  =>  /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;


  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id,
  });

  res.status(200).json({
    order,
  });
});

// Get current user orders  =>  /api/v1/me/orders
export const myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    orders,
  });
});

// Get order details  =>  /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({
    order,
  });
});

// Get all orders - ADMIN  =>  /api/v1/admin/orders
export const allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  return res.status(200).json({
    orders,
  });
});

// Update Order - ADMIN  =>  /api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  if (order?.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  // Update products stock
  await Promise.all(
  order?.orderItems?.map(async (item) => {
    const product = await Product.findById(item?.product?.toString());
    if (!product) {
      throw new ErrorHandler("No Product found with this ID", 404);
    }
    product.stock = product.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  })
);


  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();

  await order.save();

  return res.status(200).json({
    success: true,
  });
});

// Delete order  =>  /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });
});

/* 
  The Goal is to send back an object with 
  Array of Sales, Number of Orders and Total Sales for each day.
  and 
  Aggregated Total Sales and Number of Orders for the entire period.
*/
const getSalesData = async (startDate, endDate, analytics = false) => {
  // Generate array of all dates in range for complete timeline
  const datesBetween = getDatesBetween(startDate, endDate);

  // MongoDB Aggregation Pipeline
  const salesData = await Order.aggregate([
    // Stage 1: Filter orders within date range
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    // Stage 2: Group and calculate metrics by date
    {
      $group: {
        // Group by date (converted from ISO to YYYY-MM-DD format)
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
        },
        // Calculate financial metrics
        totalSalesPerDay: { $sum: "$totalAmount" },
        numOrdersPerDay: { $sum: 1 }, // Count of orders
        
        // Collect unique order statuses (Processing, Shipped, Delivered)
        orderStatuses: { $addToSet: "$orderStatus" },
        
        // Collect unique payment methods (COD, Card)
        paymentMethods: { $addToSet: "$paymentMethod" },
        
        // Collect unique delivery locations
        locations: {
          $addToSet: {
            city: "$shippingInfo.city",
            country: "$shippingInfo.country",
            zipCode: "$shippingInfo.zipCode"
          }
        },
        
        // Sum of all items quantities across all orders
        totalQuantity: { $sum: { $sum: "$orderItems.quantity" } }
      }
    },
    // Stage 3: Sort results by date descending
    {
      $sort: { "_id.date": -1 }
    }
  ]);

  // If analytics flag is true, return raw aggregation data for AI processing
  if(analytics) {
    return { salesData };
  }

  // Initialize data structures for processing
  const salesMap = new Map(); // Store daily data for O(1) lookup
  let totalSales = 0;        // Running total of all sales
  let totalOrders = 0;       // Running count of all orders

  // Process each day's aggregation results
  salesData.forEach((entry) => {
    const date = entry._id.date;
    // Create standardized format for each day's data
    const salesForDay = {
      totalSalesPerDay: entry.totalSalesPerDay,
      numOrdersPerDay: entry.numOrdersPerDay,
      orderStatuses: entry.orderStatuses,
      paymentMethods: entry.paymentMethods,
      locations: entry.locations,
      totalQuantity: entry.totalQuantity
    };

    // Store in map and update running totals
    salesMap.set(date, salesForDay);
    totalSales += entry.totalSalesPerDay;
    totalOrders += entry.numOrdersPerDay;
  });

  // Generate final dataset with all dates (including those with no sales)
  const finalSalesData = datesBetween.map((date) => {
    // Get data for this date or use default empty values
    const dateData = salesMap.get(date) || {
      totalSalesPerDay: 0,
      numOrdersPerDay: 0,
      orderStatuses: [],
      paymentMethods: [],
      locations: [],
      totalQuantity: 0
    };

    return {
      date,
      ...dateData
    };
  });

  // Return processed data with totals
  return {
    finalSalesData,  // Array of daily data
    totalSales,      // Aggregate sales amount
    totalOrders      // Total number of orders
  };
};


// Return an array of dates between start and end date
const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  /* 
    getDate to fetch day of month
    setDate to set day of month
  */
  while (currentDate <= new Date(endDate)) {
    //ISO String format = '2025-02-04T09:19:19.359Z'
    const formattedDate = currentDate.toISOString().split("T")[0];
    dates.push(formattedDate);
    //Incrementing current date by one
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Route - `/admin/get_sales?startDate=${startDate}&endDate=${endDate}`
// Return Sales Data for a given date range
export const getSales = catchAsyncErrors(async (req, res, next) => {
  const startDate = new Date(req?.query?.startDate);
  const endDate = new Date(req?.query?.endDate);

  if (!startDate || !endDate) {
    return res.status(400).json({
      message: "Date Range Not Complete"
    });
  }

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  const result = await getSalesData(startDate, endDate);

  res.status(200).json({
    salesData: result.finalSalesData,
    totalSales: result.totalSales,
    totalOrders: result.totalOrders
  });
});


// Route - `/admin/get_salesAI?startDate=${startDate}&endDate=${endDate}`
// Return Sales Data for Analytics
export const getSalesAI = catchAsyncErrors(async (req, res, next) => {
  const startDate = new Date(req?.query?.startDate);
  const endDate = new Date(req?.query?.endDate);

  if (!startDate || !endDate) {
    return res.status(400).json({
      message: "Date Range Not Complete"
    });
  }

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  //Set analytics flag to true
  const result = await getSalesData(startDate, endDate, true);

  res.status(200).json({
    salesData: result.salesData,
  });
});

