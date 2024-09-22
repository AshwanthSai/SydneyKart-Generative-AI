import mongoose from "mongoose"

const ordersSchema = new mongoose.Schema({
    shippingInfo: {
        address : {
            type: String, 
            required : true
        },
        city : {
            type: String, 
            required : true
        },
        phoneNo : {
            type: String, 
            required : true
        },
        zipCode : {
            type: String, 
            required : true
        },
        country : {
            type: String, 
            required : true
        }
    },
    user : {type: mongoose.Types.ObjectId, ref: "User", required : true},
    orderItems: [
        {
            name: {
                type : String,
                required : true,
            },
            quantity: {
                type : Number,
                required : true,
            },
            image: {
                type : String,
                required : true,
            },
            price: {
                type : String,
                required : true,
            },
            /*
             You write the Schema name instead of the document name
            */
            product: {type: mongoose.Types.ObjectId, ref: "Product", required : true}
        }
    ],
    paymentMethod : {
        type : String,
        required : [true, "Please select payment method"],
        /* Notice, how we are enforcing Enums */
        enum: {
            values : ["COD", "Card"],
            message : "Please select : COD or Card"
        }
    },
    /* For Stripe */
    paymentInfo: {
        id : String,
        status: String
    },
    itemsPrice: {
        type : Number, 
        required: true
    },
    taxAmount: {
        type : Number, 
        required: true
    },
    shippingAmount: {
        type : Number, 
        required: true
    },
    totalAmount: {
        type : Number, 
        required: true
    },
    orderStatus: {
        type: String,
        enum : {
            values : ["Processing","Shipped", "Delivered"],
            message: "Please select correct order status"
        },
        default : "Processing"
    },
    /* Notice a Date Data Type */
    deliveredAt : Date
}, {timestamps: true})


/* Collection will be made as orders */
export default mongoose.model("Order", ordersSchema)