import 'dotenv/config'
import Product from '../../../models/product.js'
import sendEmailViaNodemailer from "../../../utils/sendEmail.js";
import { generateEmailTemplate } from './utils/genericEmailTemplate.js';
import { logMessage } from '../ui.js';
import {showLoader} from "../ui.js"

export const inventoryManagementDefinition = {
  name: 'checkInventory',
  description: 'Check inventory levels and notify admin about out-of-stock items',
  parameters: {
    type: 'object',
    properties: {
      threshold: {
        type: 'number',
        description: 'Stock threshold to consider product as low inventory',
        default: 0
      },
      adminEmail: {
        type: 'string',
        description: 'Admin email to notify',
        default: 'ashwanth.saie@gmail.com'
      }
    }
  }
};

export const checkInventory = async (prompt, socket) => {
  if(socket?.user?.isAdmin === false) {
    return "You do not have an Admin role to perform this action, Kindly log in with the correct credentials"
  }
  showLoader({status: "stop",socket})
  showLoader({status: "status", message : 'Analyzing..', socket})
  try {
    const { threshold = 0, adminEmail = 'ashwanth.saie@gmail.com' } = JSON.parse(prompt);
    
    // Find all products with stock below threshold
    const lowStockProducts = await Product.find({ 
      stock: { $lte: threshold }
    }).select('name stock price category seller');

    if (lowStockProducts.length === 0) {
      return JSON.stringify({
        status: 'success',
        message: 'All products are in stock',
        lowStockCount: 0
      });
    }

    // Format products for email
    const productsList = lowStockProducts.map(product => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${product.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${product.category}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${product.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${product.stock === 0 ? 'red' : 'orange'};">
          ${product.stock}
        </td>
      </tr>
    `).join('');

    // Create email content
    const emailContent = {
      subject: `🚨 Inventory Alert: ${lowStockProducts.length} Products Need Attention`,
      preheaderText: `${lowStockProducts.length} products are low in stock or out of stock`,
      mainContent: `
        <p>The following products need your attention:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: left;">Category</th>
              <th style="padding: 10px; text-align: left;">Price</th>
              <th style="padding: 10px; text-align: left;">Stock</th>
            </tr>
          </thead>
          <tbody>
            ${productsList}
          </tbody>
        </table>
      `,
      button: {
        text: "View Inventory",
        url: "https://portfoliosai.link/sydneykart/admin/products",
        style: "blue"
      }
    };

    // Send email notification
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
          address: '1234 Street Rd.',
          suite: 'Suite 1234'
        }
      })
    });

    showLoader({status: "stop",socket})

    return JSON.stringify({
      status: 'success',
      message: `Inventory check complete. ${lowStockProducts.length} products need attention.`,
      lowStockProducts: lowStockProducts.map(p => ({
        name: p.name,
        stock: p.stock,
        category: p.category
      })),
      emailSent: true,
      notifiedAdmin: adminEmail
    }, null, 2);

  } catch (error) {
    console.error('Error checking inventory:', error);
    throw new Error(`Failed to check inventory: ${error.message}`);
  }
};