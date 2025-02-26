import axios from 'axios';
import 'dotenv/config'
import {showLoader} from "../ui.js"
import {logMessage} from "../ui.js"

// Helper function to get today's date in ISO format
const getTodayISO = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Set to start of day
  return today.toISOString();
};

// Helper function to get date 30 days ago in ISO format
const get30DaysAgoISO = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  date.setHours(0, 0, 0, 0);  // Set to start of day
  return date.toISOString();
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) && dateString.includes('T');
};

export const analyzeSalesDefinition = {
  name: 'analyzeSales',
  description: 'Analyze sales data and trends within a specified date range. Please provide both start and end dates.',
  parameters: {
    type: 'object',
    properties: {
      startDate: {
        type: 'string',
        description: 'Start date for analysis in ISO format. If not sure, use the current date and time for computation from System Prompt',
        format: 'date-time',
        examples: [get30DaysAgoISO()]
      },
      endDate: {
        type: 'string',
        description: 'End date for analysis in ISO format. If not sure, use the current date and time for computation from System Prompt',
        format: 'date-time',
        examples: [getTodayISO()]
      },
      analysisType: {
        type: 'string',
        enum: ['daily_sales', 'payment_methods', 'order_status', 'location_analysis', 'product_performance'],
        description: 'Type of analysis to perform on the sales data',
        examples: ['daily_sales']
      }
    },
    required: ['startDate', 'endDate', 'analysisType']
  }
};

export const analyzeSales = async (prompt, socket) => {
  if(socket?.user?.role !== "admin"){
    return "You do not have an Admin role to perform this action, Kindly log in with the correct credentials"
  }
  // Stop any existing status
  showLoader({status: "stop",socket})
  showLoader({status: "status", message : 'Analyzing..', socket})
  try {
    let data = JSON.parse(prompt);
    
    // Validate dates are provided
    if (!data.startDate || !data.endDate) {
      return JSON.stringify({
        error: true,
        message: "Please provide both start and end dates for the analysis. I cannot assume or generate dates automatically.",
        example: {
          startDate: get30DaysAgoISO(),
          endDate: getTodayISO(),
          analysisType: "daily_sales"
        }
      }, null, 2);
    }

    // Validate date format
    if (!isValidDate(data.startDate) || !isValidDate(data.endDate)) {
      return JSON.stringify({
        error: true,
        message: "Invalid date format. Please provide dates in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)",
        example: {
          startDate: get30DaysAgoISO(),
          endDate: getTodayISO()
        }
      }, null, 2);
    }
   

    // Create URL object to see the complete URL with params
    const baseURL = process.env.NODE_ENV="DEVELOPMENT" ? "http://localhost:4000/api/v1" : process.env.BACKEND_URL
    const url = new URL(`${baseURL}/admin/get_salesAI`);
    url.searchParams.append('startDate', data?.startDate);
    url.searchParams.append('endDate', data?.endDate);
    url.searchParams.append('analytics', 'true');

    const response = await axios.get(url.toString());


    
    // Check response status
    if (response.status !== 200) {
      throw new Error(`API returned status ${response.status}`);
    }

    // Axios automatically parses JSON response
    const salesData = response.data;
      // Stop any existing status
    // Stop any existing status
    logMessage({
      message:  `📊 Analysis Complete`,
      socket
    });
    showLoader({status: "stop",socket})
    return JSON.stringify(salesData, null, 2);
  } catch (error) {
    console.error('Error analyzing sales:', error);
    return `Error: Failed to analyze sales data - ${error.message}`;
  }
};