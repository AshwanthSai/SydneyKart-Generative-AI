/* Since exporting Single Function, we need to destructure */
import Product from "../models/products.js";

export const getProducts = async(req, res) => {
    const product = await Product.find()
    return res.status(200).json(product);
}

// Create a New Product => /api/v1/admin/products
export const newProduct = async(req, res) => {
    const product = await Product.create(req.body)
    return res.status(200).json(product);
}

