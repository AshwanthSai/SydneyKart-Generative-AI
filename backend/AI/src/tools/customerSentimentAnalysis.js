import axios from 'axios';
import Product from '../../../models/product.js';
import { logMessage } from '../ui.js';
import {showLoader} from "../ui.js"

export const customerSentimentAnalysisDefinition = {
    name: 'customerSentimentAnalysis',
    description: 'Analyze customer reviews and sentiment for a specific product',
    parameters: {
      type: 'object',
      properties: {
        productName: {
          type: 'string',
          description: 'Name of the product to analyze reviews for',
          examples: ['MacBook Air M1']
        },
        aspectAnalysis: {
          type: 'string',
          enum: ['overall_sentiment', 'feature_feedback', 'service_quality', 'price_value', 'comparison'],
          description: 'Type of sentiment analysis to perform on reviews',
          examples: ['overall_sentiment']
        },
      },
      required: ['productName']
    }
  };


/* 
- Returns all the reviews of a Product via its Name in Natural Language.
*/
export const customerSentimentAnalysis = async (prompt) => {
    const parameters = JSON.parse(prompt)
    const {productName, aspectAnalysis} = parameters
    showLoader({status: "stop",socket})
    showLoader({status: "status", message : 'Analyzing..', socket})
    try {
         // 1. First try exact match
        let product = await Product.findOne({ 
            name: productName 
        }).select('_id reviews');
        
        // 2. If no exact match, try case-insensitive partial match
        if (!product) {
            product = await Product.findOne({ 
                name: { 
                    $regex: new RegExp(productName, 'i') 
                } 
            }).select('_id reviews');
        }
        showLoader({status: "stop",socket})
        return JSON.stringify(product.reviews, null, 2);
    } catch (error) {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('Network Error:', error.message);
        } else {
            console.error('Error:', error.message);
        }
    }
};