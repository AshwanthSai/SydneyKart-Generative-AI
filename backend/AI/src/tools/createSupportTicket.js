import 'dotenv/config'
import { generateEmailTemplate } from './utils/genericEmailTemplate.js';
import sendEmailViaNodemailer from "../../../utils/sendEmail.js";
import { logMessage } from '../ui.js';
import { showLoader } from "../ui.js"

export const createSupportTicketDefinition = {
  name: 'createSupportTicket',
  description: `Handle customer support requests by creating tickets and sending notifications:
    - Process customer complaints about products, delivery, or service
    - Handle product recommendations and feature suggestions
    - Manage bug reports and technical issues
    - Track general inquiries and support requests
    - Send automated email confirmations to customers
    - Alert admin team about urgent matters
    Emails will be sent to both the customer and admin@sydneykart.com`,
  parameters: {
    type: 'object',
    properties: {
      ticketDetails: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['complaint', 'recommendation', 'general_inquiry', 'bug_report', 'feature_request'],
            description: `Type of customer feedback:
              - complaint: Issues with products, service, or experience
              - recommendation: Suggestions for improvements
              - general_inquiry: Questions about products or services
              - bug_report: Technical issues with website or app
              - feature_request: New feature suggestions`,
            default: 'general_inquiry'
          },
          subject: {
            type: 'string',
            description: 'Brief, clear summary of the feedback (max 100 characters)',
            examples: ['Late delivery for order #12345', 'Website payment error', 'Product suggestion']
          },
          description: {
            type: 'string',
            description: 'Detailed explanation including relevant order numbers, products, or specific issues'
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high', 'urgent'],
            description: `Ticket priority level:
              - urgent: Critical issues requiring immediate attention (2-4 hour response)
              - high: Significant issues needing quick resolution (24 hour response)
              - medium: Standard issues (48 hour response)
              - low: General feedback (3-5 business days)`,
            default: 'medium'
          },
          category: {
            type: 'string',
            enum: ['product', 'website', 'delivery', 'payment', 'service', 'other'],
            description: `Issue category for routing:
              - product: Product-related issues or inquiries
              - website: Website functionality or navigation
              - delivery: Shipping and delivery concerns
              - payment: Payment processing issues
              - service: Customer service experience
              - other: Miscellaneous inquiries`,
            default: 'other'
          }
        },
        required: ['type', 'subject', 'description', 'category']
      }
    },
    required: ['ticketDetails']
  }
};

const DEFAULT_COMPANY_INFO = {
  name: 'SydneyKart',
  logo: 'https://portfoliosai.link/sydneykart/images/logo.png',
  website: 'https://portfoliosai.link/sydneykart/',
  address: 'Sydney',
  suite: 'Sydney CBD, Suite 1'
};

export const createSupportTicket = async (prompt, socket) => {
  showLoader({status: "status", message : 'Thinking..', socket})
  try {
    const { ticketDetails } = JSON.parse(prompt);
    
    // Validate user info
    if (!socket?.user?.email || !socket?.user?.name) {
      throw new Error('User information not available');
    }

    const customerEmail = socket.user.email;
    const customerName = socket.user.name;
    const ticketId = `${ticketDetails.type.toUpperCase()}-${Date.now()}`;

    // Validate subject length
    if (ticketDetails.subject.length > 100) {
      throw new Error('Subject must not exceed 100 characters');
    }

    // Generate email content
    const customerEmailContent = {
      subject: `Support Ticket: ${ticketId}`,
      preheaderText: `Your support request has been received`,
      mainContent: customerEmailTemplate({
        ticketId,
        type: ticketDetails.type,
        category: ticketDetails.category,
        subject: ticketDetails.subject,
        priority: ticketDetails.priority,
        description: ticketDetails.description,
        customerName,
        getNextStepsMessage,
        getResponseTimeMessage,
        getPriorityColor
      })
    };

    const adminEmailContent = {
      subject: `New Support Ticket: ${ticketId}`,
      preheaderText: `Priority: ${ticketDetails.priority.toUpperCase()}`,
      mainContent: adminEmailTemplate({
        ticketId,
        type: ticketDetails.type,
        category: ticketDetails.category,
        priority: ticketDetails.priority,
        subject: ticketDetails.subject,
        description: ticketDetails.description,
        customerName,
        customerEmail,
        getAdminActionRequired,
        getPriorityColor
      })
    };

    // Send emails in parallel
    await Promise.all([
      sendEmailViaNodemailer({
        email: customerEmail,
        subject: customerEmailContent.subject,
        message: generateEmailTemplate({
          username: customerName,
          ...customerEmailContent,
          companyInfo: DEFAULT_COMPANY_INFO
        })
      }),
      sendEmailViaNodemailer({
        email: 'admin@sydneykart.com',
        subject: adminEmailContent.subject,
        message: generateEmailTemplate({
          username: 'Admin',
          ...adminEmailContent,
          companyInfo: DEFAULT_COMPANY_INFO
        })
      })
    ]);

    showLoader({ status: "stop", socket });
    
    return JSON.stringify({
      success: true,
      ticketId,
      message: `Thank you for your ${ticketDetails.type}. Reference number: ${ticketId}`
    });

  } catch (error) {
    showLoader({ status: "stop", socket });
    console.error('Error processing feedback:', error);
    throw new Error(`Failed to process feedback: ${error.message}`);
  }
};

// Helper functions
function getNextStepsMessage(type) {
  const messages = {
    complaint: 'Our customer service team will investigate your complaint and respond within 24 hours.',
    recommendation: 'Our product team will review your suggestion in their next planning meeting.',
    general_inquiry: 'Our support team will provide you with the information you need.',
    bug_report: 'Our technical team will investigate the issue and provide an update.',
    feature_request: 'Our product team will evaluate your request and respond with feedback.'
  };
  return messages[type] || 'Our team will review your feedback and respond accordingly.';
}

function getResponseTimeMessage(priority) {
  const times = {
    urgent: '2-4 hours',
    high: '24 hours',
    medium: '48 hours',
    low: '3-5 business days'
  };
  return times[priority] || '48 hours';
}

function getAdminActionRequired(type, priority) {
  if (priority === 'urgent') {
    return '⚠️ IMMEDIATE ACTION REQUIRED - Respond within 2 hours';
  }
  const actions = {
    complaint: '👋 Contact customer within 24 hours',
    bug_report: '🐛 Investigate technical issue',
    feature_request: '💡 Review with product team',
    recommendation: '📝 Add to product roadmap discussion',
    general_inquiry: '📨 Provide requested information'
  };
  return actions[type] || 'Review and respond appropriately';
}

function getPriorityStyle(priority) {
  const styles = {
    urgent: 'red',
    high: 'orange',
    medium: 'blue',
    low: 'green'
  };
  return styles[priority] || 'blue';
}



export const customerEmailTemplate = ({ ticketId, type, category, subject, priority, description, customerName }) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .ticket-container { padding: 20px; font-family: Arial, sans-serif; }
    .ticket-header { background: #f8f9fa; padding: 15px; border-radius: 8px; }
    .ticket-details { margin: 20px 0; border: 1px solid #dee2e6; padding: 15px; border-radius: 8px; }
    .contact-info { background: #e9ecef; padding: 15px; border-radius: 8px; margin-top: 20px; }
    .priority-tag { 
      padding: 5px 10px;
      border-radius: 4px;
      color: white;
      background: ${getPriorityColor(priority)};
    }
  </style>
</head>
<body>
  <div class="ticket-container">
    <div class="ticket-header">
      <h2>Support Ticket Confirmation</h2>
      <p>Dear ${customerName},</p>
      <p>Thank you for reaching out to us. We have received your support request.</p>
    </div>

    <div class="ticket-details">
      <h3>Ticket Information</h3>
      <p><strong>Reference Number:</strong> ${ticketId}</p>
      <p><strong>Type:</strong> ${type.replace('_', ' ').toUpperCase()}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Priority:</strong> <span class="priority-tag">${priority.toUpperCase()}</span></p>
      
      <h4>Your Message:</h4>
      <p>${description}</p>

      <h4>Next Steps:</h4>
      <p>${getNextStepsMessage(type)}</p>
      <p><strong>Expected Response Time:</strong> ${getResponseTimeMessage(priority)}</p>
    </div>

    <div class="contact-info">
      <h4>Need Immediate Assistance?</h4>
      <p>Contact us at:</p>
      <ul>
        <li>Phone: 1800-SYDKART</li>
        <li>Email: support@sydneykart.com</li>
      </ul>
    </div>
  </div>
</body>
</html>`;

export const adminEmailTemplate = ({ ticketId, type, category, priority, subject, description, customerName, customerEmail }) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .admin-container { padding: 20px; font-family: Arial, sans-serif; }
    .alert-header { 
      background: ${getPriorityColor(priority)}; 
      color: white; 
      padding: 15px; 
      border-radius: 8px; 
    }
    .customer-info { background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 8px; }
    .ticket-content { border: 1px solid #dee2e6; padding: 15px; border-radius: 8px; }
    .action-button {
      display: inline-block;
      padding: 10px 20px;
      background: #0056b3;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="admin-container">
    <div class="alert-header">
      <h2>🔔 New Support Ticket Alert</h2>
      <p>Priority: ${priority.toUpperCase()}</p>
    </div>

    <div class="customer-info">
      <h3>Customer Information</h3>
      <p><strong>Name:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
    </div>

    <div class="ticket-content">
      <h3>Ticket Details</h3>
      <p><strong>ID:</strong> ${ticketId}</p>
      <p><strong>Type:</strong> ${type.toUpperCase()}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      
      <h4>Description:</h4>
      <p>${description}</p>

      <h4>Required Action:</h4>
      <p>${getAdminActionRequired(type, priority)}</p>
    </div>

    <a href="https://portfoliosai.link/sydneykart/admin/support/${ticketId}" 
       class="action-button">
       Process Ticket
    </a>
  </div>
</body>
</html>`;

function getPriorityColor(priority) {
  const colors = {
    urgent: '#dc3545',
    high: '#fd7e14',
    medium: '#0d6efd',
    low: '#198754'
  };
  return colors[priority] || '#0d6efd';
}