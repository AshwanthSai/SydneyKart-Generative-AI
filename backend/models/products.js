import mongoose from "mongoose";

/* 
    This is a Schema, which gets converted to a Product 
*/
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name"],
        maxLength: [200, "Product name cannot exceed 200 characters"],
    },
    price: {
        type: Number,
        required: [true, "Please enter a price"],
        min: [0, "Price cannot be negative"], // Optional: Ensure price is not negative
        max: [99999, "Price cannot exceed 5 digits"], // Use max for numerical limits
    },
    description : {
        type: String,
        required: [true, "Please enter a description"],
    }, 
    ratings : {
        type: Number,
        default : 0
    },
    images : [
        {
            public_id : {
                type: String,
                required: true // Notice there is no Validation Error Here
            }, 
            url : {
                type: String,
                required: true
            }
        }
    ],
    category : {
        type : String, 
        required : [true,"Please enter product category"],
        enum : {
            values : [
                "Electronics",
                "Cameras",
                "Laptops",
                "Accessories",
                "Headphones",
                "Food",
                "Books",
                "Sports",
                "Outdoor",
                "Home",
            ],
            message : "Please select a valid category"
        }
    },
    seller : {
        type : String,
        required : [true, "Please enter seller details"]
    },
    stock : {
        type : Number, 
        required : [true, "Please enter product stock"]
    },
    numOfReviews : {
        type : Number, 
        default : 0
    },
    reviews : [
        {
            user : {
                /* type = Internal mongoose ID */
                /*
                    ref : User, One to Many Relationships. 
                    One product can have multiple user reviews
                */
                type : mongoose.Schema.Types.ObjectId,
                ref: "User",
                required : true
            },
            rating : {
                type : Number,
                required : true
            },
            comment : {
                type : String,
                required : true
            },
        },
    ],
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
}, {timestamps : true}); // TimeStamps adds an CreatedAt and UpdatedAt field to the Document.

/* A document called products will be created in the Collection */
export default mongoose.model('Product', productSchema);