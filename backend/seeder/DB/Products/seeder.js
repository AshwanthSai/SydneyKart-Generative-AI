import mongoose from "mongoose"
import dotenv from "dotenv";
import Product from "../../../models/product.js";
import {products} from "./product.js";

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars with absolute path
dotenv.config({ path: join(__dirname, '../config/config.env') });

const seedProducts = async() => {
    try {
        await mongoose.connect(`mongodb://127.0.0.1:27017/SydneyKart`)
        console.log("Database Connected")

        await Product.deleteMany();
        console.log("Products Collection Cleared")

        // Add default user ID to all products
        const productsWithUser = products.map(product => ({
            ...product,
            user: new mongoose.Types.ObjectId("65f4f65b15d2c69f9f8b2c3d") // Replace with your admin user ID
        }));

        await Product.insertMany(productsWithUser, { validateBeforeSave: false })
        console.log("Products are inserted")

        process.exit();
    } catch(error) {
        console.error(error.message) 
        process.exit();
    }
}

seedProducts();