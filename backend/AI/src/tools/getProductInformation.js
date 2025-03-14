import axios from 'axios';
import Product from '../../../models/product.js';

export const getProductInformationDefinition = {
    name: 'getProductInformation',
    description: 'Get detailed product information including specifications, pricing, and reviews',
    parameters: {
      type: 'object',
      properties: {
        productName: {
          type: 'string',
          description: 'Name of the product to retrieve information for',
          examples: ['MacBook Air M1']
        },
        infoType: {
          type: 'string',
          enum: ['full', 'basic', 'specs', 'pricing', 'reviews', 'stock'],
          description: 'Type of product information to retrieve',
          default: 'full',
          examples: ['full']
        },
      },
      required: ['productName']
    }
};

/* 
- Returns detailed product information based on product name
- Supports different types of information retrieval (full, basic, specs, etc.)
- Includes fuzzy search for product names
*/
export const getProductInformation = async (prompt, socket) => {
    showLoader({status: "status", message : 'Thinking..', socket})
    const parameters = JSON.parse(prompt);
    const { productName, infoType = 'full' } = parameters;

    try {
        // 1. First try exact match
        let product = await Product.findOne({ 
            name: productName 
        });
        
        // 2. If no exact match, try case-insensitive partial match
        if (!product) {
            product = await Product.findOne({ 
                name: { 
                    $regex: new RegExp(productName, 'i') 
                } 
            });
        }

        if (!product) {
            throw new Error(`Product "${productName}" not found`);
        }

        // 3. Format response based on infoType
        const response = {
            basic: {
                name: product.name,
                price: product.price,
                description: product.description,
                category: product.category,
                brand: product.brand
            },
            specs: product.specifications || {},
            pricing: {
                price: product.price,
                discount: product.discount,
                priceHistory: product.priceHistory || [],
                stock: product.stock
            },
            reviews: product.reviews || [],
            stock: {
                inStock: product.stock > 0,
                quantity: product.stock,
                seller: product.seller
            }
        };

        // Return specific information or full product details
        const result = infoType === 'full' ? 
            { ...response.basic, ...response.specs, ...response.pricing, reviews: response.reviews } :
            response[infoType] || response.basic;

        return JSON.stringify(result, null, 2);
    } catch (error) {
        console.error('Error retrieving product information:', error.message);
        throw error;
    }
};