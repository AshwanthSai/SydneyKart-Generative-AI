import axios from 'axios';
import 'dotenv/config'

export const analyzeSalesDefinition = {
  name: 'analyzeSales',
  description: 'Analyze sales data and trends from our ecommerce platform within a specified date range',
  parameters: {
    type: 'object',
    properties: {
      startDate: {
        type: 'string',
        description: 'Start date for analysis in ISO format',
        format: 'date-time',
        examples: ['2024-02-01T00:00:00.000Z']
      },
      endDate: {
        type: 'string',
        description: 'End date for analysis in ISO format',
        format: 'date-time',
        examples: ['2024-02-12T23:59:59.999Z']
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


// Implementation function
export const analyzeSales = async (prompt) => {
  let data = JSON.parse(prompt)
  console.log(typeof data)
  const startDate = data?.startData
  const endDate = data?.endDate
  const analysisType = data?.analysisType

  console.log(startDate)
  console.log(endDate)
  console.log(analysisType)
  // Log the expected URL format
  console.log('Expected URL format:', 'http://localhost:4000/api/v1/admin/get_sales?startDate=2024-11-01T11:42:27.000Z&endDate=2025-02-12T11:42:27.766Z');

  try {
    // Create URL object to see the complete URL with params
    const url = new URL(`${process.env.BACKEND_URL}/api/v1/admin/get_salesAI`);
    url.searchParams.append('startDate', startDate);
    url.searchParams.append('endDate', endDate);
    url.searchParams.append('analytics', 'true');
    
    // Log complete URL before request
    console.log('🔍 Complete URL:', url.toString());

    const response = await axios.get(url.toString());

    // Log actual requested URL after response
    console.log('📡 Actual requested URL:', response.request.res.responseUrl);
    

    // Check response status
    if (response.status !== 200) {
      throw new Error(`API returned status ${response.status}`);
    }

    // Log analysis info
    console.log(`📊 Analyzing ${analysisType} from ${startDate} to ${endDate}`);

    // Axios automatically parses JSON response
    const salesData = response.data;
    console.log('Sales Data:', salesData);

    return JSON.stringify(salesData, null, 2);
  } catch (error) {
    console.error('Error analyzing sales:', error);
    return `Error: Failed to analyze sales data - ${error.message}`;
  }
};