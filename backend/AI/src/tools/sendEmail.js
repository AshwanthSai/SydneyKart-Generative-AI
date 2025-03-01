import 'dotenv/config'
import { generateEmailTemplate } from './utils/genericEmailTemplate.js';
import sendEmailViaNodemailer from "../../../utils/sendEmail.js";
import { logMessage } from '../ui.js';
import {showLoader} from "../ui.js"

export const sendEmailDefinition = {
  name: 'sendEmail',
  description: 'Send email using customizable template with optional button',
  parameters: {
    type: 'object',
    properties: {
      recipient: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Recipient name',
          },
          email: {
            type: 'string',
            description: 'Recipient email address',
          }
        },
        required: ['name', 'email']
      },
      emailContent: {
        type: 'object',
        properties: {
          subject: {
            type: 'string',
            description: 'Email subject line'
          },
          preheaderText: {
            type: 'string',
            description: 'Preview text shown in email clients'
          },
          mainContent: {
            type: 'string',
            description: 'Main email content, this is injected into an HTML Template'
          },
          button: {
            type: 'object',
            properties: {
              text: { type: 'string' },
              url: { type: 'string' },
              style: { 
                type: 'string',
                enum: ['green', 'blue', 'red']
              },
              color: { type: 'string' }
            },
            required: ['text', 'url']
          }
        },
        required: ['subject', 'preheaderText', 'mainContent']
      },
      companyInfo: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          logo: { type: 'string' },
          website: { type: 'string' },
          address: { type: 'string' },
          suite: { type: 'string' }
        }
      }
    },
    required: ['recipient', 'emailContent']
  }
};

// Add this constant at the top of the file after imports
const DEFAULT_COMPANY_INFO = {
  name: 'SydneyKart',
  logo: 'https://portfoliosai.link/sydneykart/images/logo.png',
  website: 'https://portfoliosai.link/sydneykart/',
  address: 'Sydney',
  suite: 'Sydney CBD, Suite 1'
};


export const sendEmail = async (prompt, socket) => {
  if(socket?.user?.isAdmin === false) {
    return "You do not have an Admin role to perform this action, Kindly log in with the correct credentials"
  }
  showLoader({status: "stop",socket})
  showLoader({status: "status", message : 'Analyzing..', socket})
  try {
    const { recipient, emailContent, companyInfo = DEFAULT_COMPANY_INFO} = JSON.parse(prompt);

    // Format mainContent by replacing \n with HTML line breaks
    const formattedContent = emailContent.mainContent
    .replace(/\\n/g, '<br>')  // Replace \n with <br>
    .replace(/\n/g, '<br>')   // Replace actual line breaks with <br>
    .replace(/(Hello|Hi)\s+\w+,\s*<br>\s*(Hello|Hi)\s+\w+,/, '$1 $2') // Remove duplicate greeting
    .trim();

    // Generate HTML email using template
    const htmlEmail = generateEmailTemplate({
      username: recipient.name,
      ...emailContent,
      mainContent: formattedContent,
      companyInfo
    });

    await sendEmailViaNodemailer({
      email: recipient.email,
      subject: emailContent?.subject,
      message: htmlEmail,
    });
    
    showLoader({status: "stop",socket})
    return JSON.stringify({
      success: true,
      message: `Email sent successfully to ${recipient.email}`
    });

  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}



