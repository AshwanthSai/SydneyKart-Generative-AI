import axios from 'axios';
import fetch from 'node-fetch'

export const getAllProductsDefinition = {
  name: 'getAllProducts',
  description: 'Get all products from the e-commerce store with their details',
}

export const getAllProducts = async (prompt, socket) => {
  if(socket?.user?.role !== "admin"){
    return "You do not have an Admin role to perform this action, Kindly log in with the correct credentials"
  }
  try {
    const response = await axios.get(`${process.env.BACKEND_URL}/ingest/products`);
    // Clean up and supply only relevant product data
    const relevantInfo = response.data.products.map(product => ({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      stock: product.stock,
      ratings: product.ratings,
      numOfReviews: product.numOfReviews,
      id: product._id
    }));

    return JSON.stringify(relevantInfo, null, 2);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products from the store');
  }
}