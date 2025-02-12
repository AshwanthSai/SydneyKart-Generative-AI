import 'dotenv/config'
import OpenAI from 'openai'
const openai = new OpenAI()

export const generateImagesDefinition = {
  name: 'generateSalesChart',
  description: 'Generate a visual chart from sales data with customizable parameters',
  parameters: {
    type: 'object',
    properties: {
      chartType: {
        type: 'string',
        enum: ['bar', 'line', 'pie', 'area'],
        description: 'Type of chart to generate'
      },
      startDate: {
        type: 'string',
        description: 'Start date for sales data in ISO format (e.g., 2024-02-01T00:00:00.000Z)'
      },
      endDate: {
        type: 'string',
        description: 'End date for sales data in ISO format (e.g., 2024-02-12T23:59:59.999Z)'
      },
      metric: {
        type: 'string',
        enum: ['revenue', 'orders', 'items_sold', 'average_order_value'],
        description: 'Sales metric to visualize'
      },
      customPrompt: {
        type: 'string',
        description: 'Additional styling or visualization instructions (optional)'
      }
    },
    required: ['chartType', 'startDate', 'endDate', 'metric']
  }
};

export const generateSalesChart = async ({ chartType, startDate, endDate, metric, customPrompt = '' }) => {
  // Construct a detailed prompt for the chart generation
  const prompt = `Generate a professional ${chartType} chart showing ${metric} data from ${startDate} to ${endDate}. 
    Make it business-appropriate with clear labels and legend. ${customPrompt}`;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
  });

  return response.data[0].url;
};
