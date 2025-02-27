import mongoose from "mongoose"
import dotenv from "dotenv";
import Order from "../../../models/order.js";  // Updated path to models directory
import {data} from "./orders.js"

dotenv.config({path : "backend/config/config.env"})

const seedProducts = async() => {
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log("Database Connected")

        await Order.deleteMany();
        console.log("Orders Collection Cleared")

        await Order.insertMany(data, { validateBeforeSave: false })
        console.log("Orders are inserted")

        process.exit();
    } catch(error) {
        console.error(error.message) 
        process.exit();
    }
}

seedProducts();