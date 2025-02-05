import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";

const seedProducts = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/shopit-v2");

    await Product.deleteMany();
    console.log("Products are deleted");

    // Add default user ID to all products
    const productsWithUser = products.map(product => ({
        ...product,
        user: "678a9690784c2844400dec65" // Replace with valid admin user ID
    }));
  
    await Product.insertMany(productsWithUser);
    console.log("Products are added");;

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
