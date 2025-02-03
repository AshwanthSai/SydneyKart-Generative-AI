import { Stripe } from "stripe"
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import order from "../models/order.js";
const stripe = new Stripe(process.env.STRIPE_KEY);


/* 
  1.  We create a stripe session with the order items and shipping info.
      if successful it sends a stripe session url to the frontend.
  2.  The user is redirected to the stripe checkout page.
      On Completion, Stripe sends a webhook to our backend, asynchronously.
  3.  We verify the webhook signature(to prevent stripe request forgery)
  4.  If the event type is checkout.session.completed, we create an order in our DB.
      We fetch the order items from the stripe session + some meta data 
      and create an order in our DB.
*/

// Create stripe checkout session   =>  /api/v1/payment/checkout_session
export const stripeCheckoutSession = catchAsyncErrors(async (req, res, next) => {
    // Validate request body
    if (!req.body.orderItems || !req.body.shippingInfo) {
      return next(new ErrorHandler("Missing required fields", 400));
    }
  
    const line_items = req.body.orderItems.map((item) => {
      if (!item.name || !item.price || !item.quantity) {
        throw new Error("Invalid item data");
      }
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
            images: [item.image],
            metadata: { productId: item.product },
          },
          unit_amount: Math.round(item.price * 100 * 86),
        },
        tax_rates: ["txr_1Qnl6nA4egVe7wvQFtvKREum"],
        quantity: item.quantity,
      };
    });
  
  const shippingAmount = req?.body?.itemsPrice > 200 ? "shr_1Qnyv1A4egVe7wvQiLtHZvV2" : "shr_1QnythA4egVe7wvQ3GysVIRL" ;
  const shippingInfo = req?.body?.shippingInfo;
  
  /* 
    Bad Request Error
    Need to investigate here
  */

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        success_url: `${process.env.FRONTEND_URL}/me/orders?order_success=true`,
        cancel_url: `${process.env.FRONTEND_URL}`,
        customer_email: req?.user?.email,
        client_reference_id: req?.user?._id?.toString(),
        mode: "payment",
        metadata: { ...shippingInfo, itemsPrice: req?.body?.itemsPrice },
        shipping_options: [
          {
            shipping_rate: shippingAmount,
          },
        ],
        line_items,
      });
    
      return res.status(200).json({
        success: true,
        url: session.url,
      });
    } catch (error) {
      console.error("Error creating Stripe Checkout session:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
});

// Stripe webhook   =>  /api/v1/payment/webhook
/* 
  Why Web Hooks ?
  Why not use our DB Data ?
  - A lot of payment meta data from stripe is sent to our backend.
  - This is required in the case of a dispute or refund and things like that.
*/
export const stripeWebhook = catchAsyncErrors(async (req, res, next) => {

  try {
    /* 
      Stripe sends a unique signature with each webhook
      We verify this signature using our webhook secret
      Prevents webhook forgery/tampering
    */
    const signature = req.headers["stripe-signature"];
    /* 
      - constructEvent()
      - Constructs and verifies the signature of an Event from the provided details.
    */
    const event = stripe.webhooks.constructEvent(
      /* 
        Stripe webhooks require the raw request body to verify
        the signature. Express normally parses the body,
        but we need the unparsed version for verification.
      */
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if(event.type === "checkout.session.completed") {
      /* 
        Refetching all the data we passed to the Stripe Session in a Schema
        + Some stripe meta data.
        So that we can create an Order in our DB 
      */
      const session = event.data.object;

      const line_items = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const orderItems = await getOrderItems(line_items);
      const user = session.client_reference_id;

      const totalAmount = session.amount_total / 100;
      const taxAmount = session.total_details.amount_tax / 100;
      const shippingAmount = session.total_details.amount_shipping / 100;
      const itemsPrice = session.metadata.itemsPrice;

      const shippingInfo = {
        address: session.metadata.address,
        city: session.metadata.city,
        phoneNo: session.metadata.phoneNo,
        zipCode: session.metadata.zipCode,
        country: session.metadata.country,
      };

      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
      };

      const orderData = {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentInfo,
        paymentMethod: "Card",
        user,
      };

      await order.create(orderData);

      res.status(200).json({ success: true });
    }


  } catch (error) {
    console.error("Error creating Stripe Webhook", error);
    return res.status(400).json({
      success: false,
      message: error
    })
  }
})

/* 
  - Structuring line items in Stripe Session to our required schema.
*/
export const getOrderItems = async (line_items) => {
  return new Promise((resolve, reject) => {
    let cartItems = []

    line_items?.data?.forEach(async(item) => {
      // Retrieving Stripe Product to fetch meta details such as Stripe Product ID 
      const product = await stripe.products.retrieve(item.price.product);
      // Retrieving Product ID, we set as Stripe metadata.
      const productId = product.metadata.productId

      cartItems.push({
        product: productId,
        name: product.name,
        price: item.price.unit_amount_decimal / 100,
        quantity: item.quantity,
        image: product.images[0]
      });
      // Double check that you have all the items
      // Since the above check is async, moving this out will cause
      // it to execute before the foreach completes.
      if(cartItems.length === line_items?.data?.length) {
        // Resolve and return the promise.
        resolve(cartItems);
      }
    })
  })
}
