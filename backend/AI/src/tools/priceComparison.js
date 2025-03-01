import fetch from 'node-fetch'
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { log } from 'console';
import { logMessage } from '../ui.js';

export const priceComparisonDefinition = {
  name: 'priceComparisonFromInternet',
  description: 'Get price comparisons for a product from various online retailers',
  parameters: {
    type: 'object',
    properties: {
      productName: {
        type: 'string',
        description: 'The name of the product to search for prices'
      }
    },
    required: ['productName']
  }
};

/* 
  Price Comparison Flow
  1. We Submit a Request to Compare jobs. The API will return a job ID.
  2. We Poll the Job Status to check if the job is completed.
  3. Once Completed, we fetch the data from the API.
*/

const pollJobStatus = async (jobId, token, maxAttempts = 5) => {
  /* Send 5 requests each after 5 seconds */
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(
        `https://api.priceapi.com/v2/jobs/${jobId}?token=${token}`,
        { headers: { accept: 'application/json' } }
      );

      const result = await response.json();
      console.log(`Job Status (Attempt ${attempt + 1}):`, result.status);

      if (result.status === "finished") {
        console.log('Job completed successfully');
        return true;
      }

      // setTimeout to wait for 5 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(`Polling attempt ${attempt + 1} failed:`, error);
    }
  }
  console.log('Job polling timed out');
  return false;
};


/* 
  1. We receive a JSON file with ton of data, 
  2. We summarize all of them into MD Format and pass it to LLM as the tool Call response.
*/
const formatPriceResults = (jsonData) => {
  try {
    // Extract all results
    const result = jsonData?.results[0];
    const content = result?.content;
    const offers = content?.offers;

    // Format the product details
    const productDetails = {
      name: content?.name?.split(' - ')[0],
    };

    // Format all price offers
    const priceOffers = offers.map(offer => ({
      price: {
        base: `$${offer?.price}`,
        shipping: `$${offer?.shipping_costs}`,
        total: `$${offer?.price_with_shipping}`,
        currency: offer?.currency
      },
      seller: {
        name: offer?.shop_name,
        website: offer?.shop_domain,
        url: offer?.url,
        rating: {
          score: offer?.shop_review_rating || 'No rating',
          count: offer?.shop_review_count || 0
        }
      }
    }));

    // Sort offers by total price in ASC order. Replace $ with empty string.
    priceOffers.sort((a, b) => 
      parseFloat(a?.price?.total?.replace('$', '')) - 
      parseFloat(b?.price?.total?.replace('$', ''))
    );

    // Create markdown-formatted summary
    const summary = `
    ### ${productDetails.name}
    ${productDetails.description}

    #### Available Prices:
    ${priceOffers.map(offer => `
    - **${offer?.seller?.name}**
      - Price: ${offer?.price?.base}
      - Shipping: ${offer?.price?.shipping}
      - Total: ${offer?.price?.total}
      - [View Offer](${offer?.seller?.url})
    `).join('')}
    `;

    return {
      summary,
    }
  } catch (error) {
    console.error('Error formatting price data:', error);
    throw new Error('Failed to format price data');
  }
};


const fetchJobResults = async (jobId, token) => {
  console.log(`Fetching results for job: ${jobId}`);
  
  try {
    const response = await fetch(
      `https://api.priceapi.com/v2/jobs/${jobId}/download?token=${token}`,
      {
        method: 'GET',
        headers: { accept: 'application/json' }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Results fetched successfully');
    return data;
  } catch (error) {
    console.error('Error fetching job results:', error);
    throw error;
  }
};


export const priceComparisonFromInternet = async (productName, socket) => {
  if(socket?.user?.isAdmin === false) {
    return "You do not have an Admin role to perform this action, Kindly log in with the correct credentials"
  }
  const options = { 
    method: 'POST',
    headers: {accept: 'application/json', 'content-type': 'application/json'},
    body: JSON.stringify({
      token: process.env.PRICE_API_KEY,
      source: 'google_shopping',
      country: 'au',
      topic: 'product_and_offers',
      key: 'term',
      values: `${productName}`,
      max_pages: '1',
      // Cached upto 24 hours
      max_age: '1440', 
      timeout: '5',
    })
  };

  try {
    // Submit job
    const jobResponse = await fetch(`https://api.priceapi.com/v2/jobs?token=${process.env.PRICE_API_KEY}`, options);
    const jobResult = await jobResponse.json();
    console.log('Job Submitted:', jobResult.job_id);

    // Wait until job completes
    const finalResult = await pollJobStatus(jobResult.job_id, process.env.PRICE_API_KEY);
    
    /* 
      If job completes, format the results and pass to LLM as tool call response
    */
      if (finalResult) {
        const jobData = await fetchJobResults(jobResult.job_id, process.env.PRICE_API_KEY);
        // logMessage({message: 'Price comparison results found', socket})
        console.log('📊 Price comparison results found');
        
        const formattedResults = formatPriceResults(jobData);
        // console.log(`Found ${formattedResults.totalOffers} offers for ${productName}`);
        logMessage({message: `Found ${formattedResults.totalOffers} offers for ${productName}`, socket})
        return formattedResults.summary;
      }
  } catch (error) {
      console.error('Error fetching pricing details: ', error);
      throw error;
  }
};