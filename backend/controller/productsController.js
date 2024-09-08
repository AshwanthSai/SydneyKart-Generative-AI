/* Since exporting Single Function, we need to destructure */
import Product from "../models/products.js";

/* 
    Do not miss await for Storage Operations
*/
export const getProducts = async(req, res) => {
    const product = await Product.find()
    return res.status(200).json(product);
}

// Create a New Product => /api/v1/admin/products
export const newProduct = async(req, res) => {
    const product = await Product.create(req.body)
    return res.status(200).json(product);
}

// Get single product details => /api/v1/products/:id
export const getProductDetails = async(req, res) => {
    const product = await Product.findById(req?.params?.id)
    /* 
        Notice how we are sending back an Error
     */
    if(!product){
       return res.status(404).json({error : "Product not found"})
    }
    return res.status(200).json({product})
}

// Update single product details => /api/v1/products/:id
export const updateProduct = async(req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new : true})
    if(!product){
       return res.status(404).json({error : "Product not found"})
    }    

    return res.status(200).json({product})
}

export const deleteProduct = async(req, res) => {
    const product = await Product.findById(req?.params?.id)
    /* 
        Notice how we are sending back an Error
     */
    if(!product){
       return res.status(404).json({error : "Product not found"})
    }

    await product.deleteOne();
    return res.status(200).json({message  : "Product deleted"})
}