import mongoose from "mongoose"
import dotenv from "dotenv";
import Product from "../models/products.js";
import products from "./data.js";

dotenv.config({path : "backend/config/.env"})

const seedProducts = async() => {
    try {
        await mongoose.connect(process.env.DB_LOCAL_URI)
        console.log("Database Connected")

        await Product.deleteMany();
        console.log("Products Collection Cleared")

        // Because initial data does not have a User ID
        await Product.insertMany(products, { validateBeforeSave: false })
        console.log("Products are inserted")

        process.exit();
    } catch(error) {
        // Notice we are not logging the Error Object. But just the attribute inside it
        console.error(error.message) 
        process.exit();
    }
}

seedProducts();