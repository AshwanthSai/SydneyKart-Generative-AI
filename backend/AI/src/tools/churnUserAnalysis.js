import User from '../../../models/user.js'
import Order from '../../../models/order.js'
import 'dotenv/config'
import { generateEmailTemplate } from './utils/genericEmailTemplate.js';
import sendEmailViaNodemailer from "../../../utils/sendEmail.js";
import {showLoader} from "../ui.js"
import {logMessage} from "../ui.js"

export const churnAnalysisDefinition = {
  name: 'churnAnalysis',
  description: 'Analyze users at risk of churning based on activity patterns',
  parameters: {
    type: 'object',
    properties: {
      inactiveDays: {
        type: 'number',
        description: 'Days of inactivity to consider for churn risk',
        default: 30
      },
      sendEmail: {
        type: 'boolean',
        description: 'Whether to send email notification with results',
        default: false
      },
      adminEmail: {
        type: 'string',
        description: 'Admin email to notify',
        default: 'ashwanth.saie@gmail.com'
      }
    }
  }
};

const calculateChurnRisk = (user, orders) => {
  let riskScore = 0;
  const riskFactors = [];

  // Factor 1: Days since last order
  const lastOrder = orders[0];
  const daysSinceLastOrder = lastOrder ? 
    Math.floor((Date.now() - lastOrder.createdAt) / (1000 * 60 * 60 * 24)) : 
    Number.MAX_SAFE_INTEGER;
  
  if (daysSinceLastOrder > 60) {
    riskScore += 3;
    riskFactors.push('No orders in last 60 days');
  } else if (daysSinceLastOrder > 30) {
    riskScore += 2;
    riskFactors.push('No orders in last 30 days');
  }

  // Factor 2: Order frequency change
  if (orders.length >= 2) {
    const recentOrders = orders.slice(0, Math.min(5, orders.length));
    const avgOrderGap = recentOrders.reduce((sum, order, i, arr) => {
      if (i === 0) return sum;
      return sum + (arr[i-1].createdAt - order.createdAt);
    }, 0) / (recentOrders.length - 1);
    
    if (daysSinceLastOrder > avgOrderGap * 2) {
      riskScore += 2;
      riskFactors.push('Significant decrease in order frequency');
    }
  }

  // Factor 3: Cart abandonment
  if (user.cartItems?.length > 0) {
    riskScore += 1;
    riskFactors.push('Has abandoned cart items');
  }

  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    riskScore,
    riskFactors,
    lastOrderDate: lastOrder?.createdAt,
    totalOrders: orders.length,
    isHighRisk: riskScore >= 3
  };
};

export const churnAnalysis = async (prompt, socket) => {
  if(socket?.user?.role !== "admin"){
    return "You do not have an Admin role to perform this action, Kindly log in with the correct credentials"
  }
  
  showLoader({status: "stop",socket})
  showLoader({status: "status", message : 'Analyzing..', socket})
  try {
    const { inactiveDays = 30, sendEmail = false, adminEmail } = JSON.parse(prompt);
    
    // Find users with potential churn risk
    const users = await User.find({
        //! Todo - Create a Last Active Field which gets updated with each order placed
        //! This is a temporary solution
        updatedAt: { 
          $lte: new Date(Date.now() - inactiveDays * 24 * 60 * 60 * 1000)
        }
      }).select('name email cartItems updatedAt');

    // Analyze each user's order history
    const churnRiskUsers = await Promise.all(users.map(async (user) => {
      const orders = await Order.find({ user: user._id })
        .sort({ createdAt: -1 })
        .select('createdAt totalPrice');
      return calculateChurnRisk(user, orders);
    }));

    // Filter for high-risk users and sort by risk score
    const highRiskUsers = churnRiskUsers
      .filter(user => user.isHighRisk)
      .sort((a, b) => b.riskScore - a.riskScore);

    if (sendEmail && highRiskUsers.length > 0) {
      const emailContent = {
        subject: `🚨 Churn Risk Alert: ${highRiskUsers.length} Users at Risk`,
        preheaderText: 'User churn risk analysis report',
        mainContent: `
          <h2>Churn Risk Analysis Report</h2>
          <p>We've identified ${highRiskUsers.length} users at high risk of churning:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">User</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Risk Score</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Risk Factors</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Last Order</th>
              </tr>
            </thead>
            <tbody>
              ${highRiskUsers.map(user => `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                    <strong>${user.name}</strong><br>
                    <span style="color: #666;">${user.email}</span>
                  </td>
                  <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                    <span style="color: ${user.riskScore >= 4 ? '#dc3545' : '#ffc107'};">
                      ${user.riskScore}/6
                    </span>
                  </td>
                  <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                    ${user.riskFactors.map(factor => 
                      `<div style="margin-bottom: 4px;">• ${factor}</div>`
                    ).join('')}
                  </td>
                  <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                    ${user.lastOrderDate ? 
                      new Date(user.lastOrderDate).toLocaleDateString() : 
                      'Never'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `,
        button: {
          text: "View Customer Dashboard",
          url: "https://portfoliosai.link/sydneykart/admin/customers",
          style: "blue"
        }
      };

      await sendEmailViaNodemailer({
        email: adminEmail,
        subject: emailContent.subject,
        message: emailContent
      });
    }
    
    logMessage({
      message:  `📊 Analysis Complete`,
      socket
    });
    showLoader({status: "stop",socket})

    return JSON.stringify({
      status: 'success',
      totalAnalyzed: users.length,
      highRiskCount: highRiskUsers.length,
      highRiskUsers,
      emailSent: sendEmail
    }, null, 2);

  } catch (error) {
    console.error('Error analyzing user churn:', error);
    throw new Error(`Failed to analyze user churn: ${error.message}`);
  }
};