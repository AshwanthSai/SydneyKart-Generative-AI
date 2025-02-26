import 'dotenv/config'
import Product from '../../../models/product.js'
import sendEmailViaNodemailer from "../../../utils/sendEmail.js";
import { generateEmailTemplate } from './utils/genericEmailTemplate.js';
import 'dotenv/config'
import { queryVectorDB } from '../rag/query.js'
import { logMessage } from '../ui.js';
import {showLoader} from "../ui.js"

export const productRecommendationsDefinition = {
  name: 'productRecommendations',
  description: 'Find similar products and optionally send email notification',
  parameters: {
    type: 'object',
    properties: {
      products: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' }
          },
          required: ['name']
        }
      },
      sendEmail: {
        type: 'boolean',
        description: 'Whether to send email notification',
        default: false
      },
      adminEmail: {
        type: 'string',
        description: 'Admin email to notify',
        default: 'ashwanth.saie@gmail.com'
      }
    },
    required: ['products']
  }
};

export const productRecommendations = async (prompt, socket) => {
  if(socket?.user?.role !== "admin"){
    return "You do not have an Admin role to perform this action, Kindly log in with the correct credentials"
  }
  showLoader({status: "stop",socket})
  showLoader({status: "status", message : 'Analyzing..', socket})
  try {
    const { products, sendEmail = false, adminEmail = 'ashwanth.saie@gmail.com' } = JSON.parse(prompt);
    
    // Process each product using RAG
    const similarProductResults = await Promise.all(products.map(async (product) => {
      // Create search query using product details
      const searchQuery = `Find products similar to: ${product.name}
        ${product.category ? `in category: ${product.category}` : ''}
        ${product.description ? `with features like: ${product.description}` : ''}`;

      // Query vector DB for similar products
      const results = await queryVectorDB(searchQuery, 3); // Get top 3 matches

      // Format and filter results
      const similarItems = results
        .map(({ metadata, data }) => ({
          name: metadata.name,
          price: metadata.price,
          category: metadata.category,
          description: data,
          image: metadata.images?.[0]?.url
        }))
        .filter(item => item.name.toLowerCase() !== product.name.toLowerCase())
        .slice(0, 2); // Get top 2 after filtering out original product

      return {
        originalProduct: product.name,
        similarItems
      };
    }));

    // If email notification is requested
    if (sendEmail) {
      const emailContent = {
        subject: `Similar Products Recommendations`,
        preheaderText: `Similar product suggestions for your catalog`,
        mainContent: `
          <p>Here are the similar products found in your catalog:</p>
          ${similarProductResults.map(result => `
            <div style="margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
              <h2 style="color: #333; margin-bottom: 15px;">${result.originalProduct}</h2>
              <div style="margin-left: 20px;">
                ${result.similarItems.map(item => `
                  <div style="display: flex; margin-bottom: 20px; background-color: #f8f9fa; border-radius: 8px; padding: 15px;">
                    ${item.image ? `
                      <div style="flex: 0 0 100px; margin-right: 15px;">
                        <img src="${item.image}" 
                             alt="${item.name}" 
                             style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px;"
                        />
                      </div>
                    ` : ''}
                    <div style="flex: 1;">
                      <h3 style="margin: 0 0 8px 0; color: #2c5282;">${item.name}</h3>
                      <p style="margin: 0 0 5px 0; color: #48bb78; font-weight: bold;">$${item.price}</p>
                      <p style="margin: 0; color: #666; font-size: 14px;">
                        ${item.category ? `<span style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; margin-right: 8px;">${item.category}</span>` : ''}
                        ${item.description || ''}
                      </p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        `,
        button: {
          text: "View All Products",
          url: "https://portfoliosai.link/sydneykart/products",
          style: "blue"
        }
      };

      await sendEmailViaNodemailer({
        email: adminEmail,
        subject: emailContent.subject,
        message: generateEmailTemplate({
          username: 'Admin',
          ...emailContent,
          companyInfo: {
            name: 'SydneyKart',
            logo: 'https://portfoliosai.link/sydneykart/images/logo.png',
            website: 'https://portfoliosai.link/sydneykart/',
            address: 'Sydney',
            suite: 'Sydney CBD, Suite 1'
          }
        })
      });
    }
    showLoader({status: "stop",socket})
    
    return JSON.stringify({
      status: 'success',
      results: similarProductResults,
      emailSent: sendEmail,
      notifiedAdmin: sendEmail ? adminEmail : null
    }, null, 2);

  } catch (error) {
    console.error('Error finding similar products:', error);
    throw new Error(`Failed to find similar products: ${error.message}`);
  }
};