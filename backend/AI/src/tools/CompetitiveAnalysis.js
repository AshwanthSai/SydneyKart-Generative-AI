import fetch from 'node-fetch'
import { logMessage } from '../ui.js';

export const competitorAnalysisDefinition = {
  name: 'competitorAnalysis',
  description: 'Analyze market competitors and their positioning',
  parameters: {
    type: 'object',
    properties: {
      productName: {
        type: 'string',
        description: 'Product name to analyze competitors for'
      },
      analysisType: {
        type: 'string',
        enum: ['pricing', 'market_share', 'customer_sentiment', 'overall'],
        description: 'Type of competitor analysis to perform',
        default: 'overall'
      }
    },
    required: ['productName']
  }
};

const pollJobStatus = async (jobId, token, maxAttempts = 5) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(
        `https://api.priceapi.com/v2/jobs/${jobId}?token=${token}`,
        { headers: { accept: 'application/json' } }
      );

      const result = await response.json();
      console.log(`Job Status (Attempt ${attempt + 1}):`, result.status);

      if (result.status === "finished") return true;

      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(`Polling attempt ${attempt + 1} failed:`, error);
    }
  }
  return false;
};

const formatCompetitorAnalysis = (jsonData) => {
  try {
    const result = jsonData?.results[0];
    const content = result?.content;
    const offers = content?.offers;

    // Calculate market metrics
    const prices = offers.map(o => parseFloat(o?.price_with_shipping));
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    // Analyze competitors
    const competitors = offers.map(offer => ({
      name: offer?.shop_name,
      price: parseFloat(offer?.price_with_shipping),
      marketPosition: parseFloat(offer?.price_with_shipping) > avgPrice ? 'Premium' : 'Value',
      rating: offer?.shop_review_rating || 'N/A',
      reviewCount: offer?.shop_review_count || 0,
      url: offer?.url
    }));

    // Market analysis
    const marketMetrics = {
      totalCompetitors: competitors.length,
      averagePrice: avgPrice,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      marketSegments: {
        premium: competitors.filter(c => c.marketPosition === 'Premium').length,
        value: competitors.filter(c => c.marketPosition === 'Value').length
      }
    };

    // Generate markdown report
    const summary = `
### Market Analysis Report for ${content?.name}

#### Market Overview
- **Total Competitors:** ${marketMetrics.totalCompetitors}
- **Price Range:** $${marketMetrics.priceRange.min.toFixed(2)} - $${marketMetrics.priceRange.max.toFixed(2)}
- **Average Price:** $${marketMetrics.averagePrice.toFixed(2)}

#### Market Segmentation
- **Premium Segment:** ${marketMetrics.marketSegments.premium} competitors
- **Value Segment:** ${marketMetrics.marketSegments.value} competitors

#### Detailed Competitor Analysis
${competitors.map(comp => `
- **${comp.name}**
  - Market Position: ${comp.marketPosition}
  - Price Point: $${comp.price.toFixed(2)}
  - Customer Rating: ${comp.rating}
  - Review Count: ${comp.reviewCount}
  - [View Details](${comp.url})
`).join('')}

#### Strategic Insights
1. Market Competition: ${marketMetrics.totalCompetitors > 10 ? 'Highly Competitive' : 'Moderately Competitive'}
2. Price Spread: ${(marketMetrics.priceRange.max - marketMetrics.priceRange.min).toFixed(2)}
3. Dominant Strategy: ${marketMetrics.marketSegments.premium > marketMetrics.marketSegments.value ? 'Premium Positioning' : 'Value Leadership'}
`;

    return {
      summary,
      metrics: marketMetrics
    };
  } catch (error) {
    console.error('Error formatting competitor data:', error);
    throw new Error('Failed to analyze competitor data');
  }
};

const fetchJobResults = async (jobId, token) => {
  try {
    const response = await fetch(
      `https://api.priceapi.com/v2/jobs/${jobId}/download?token=${token}`,
      {
        method: 'GET',
        headers: { accept: 'application/json' }
      }
    );

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
};

export const competitorAnalysis = async (prompt, socket) => {
  const { productName, analysisType = 'overall' } = JSON.parse(prompt);

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      token: process.env.PRICE_API_KEY,
      source: 'google_shopping',
      country: 'au',
      topic: 'product_and_offers',
      key: 'term',
      values: productName,
      max_pages: '1',
      max_age: '1440',
      timeout: '5'
    })
  };

  try {
    logMessage({ message: '🔍 Starting competitor analysis...', socket });
    
    const jobResponse = await fetch(
      `https://api.priceapi.com/v2/jobs?token=${process.env.PRICE_API_KEY}`,
      options
    );
    const jobResult = await jobResponse.json();
    
    const finalResult = await pollJobStatus(jobResult.job_id, process.env.PRICE_API_KEY);
    
    if (finalResult) {
      const jobData = await fetchJobResults(jobResult.job_id, process.env.PRICE_API_KEY);
      const analysis = formatCompetitorAnalysis(jobData);
      
      logMessage({
        message: `📊 Analyzed ${analysis.metrics.totalCompetitors} competitors`,
        socket
      });
      
      return analysis.summary;
    }
  } catch (error) {
    console.error('Error performing competitor analysis:', error);
    throw error;
  }
};