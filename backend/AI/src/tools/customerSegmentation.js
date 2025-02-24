import Order from '../../../models/order.js';
import User from '../../../models/user.js';

export const marketSegmentationDefinition = {
    name: 'marketSegmentation',
    description: 'Analyze customer segments based on order history and behavior',
    parameters: {
        type: 'object',
        properties: {
            segmentationType: {
                type: 'string',
                /* 
                    RFM Analysis ('rfm')
                    Recency: How recently did the customer purchase?
                    Frequency: How often do they purchase?
                    Monetary: How much do they spend?
                    Used for: Identifying high-value customers and at-risk customers

                    Spending Analysis ('spending')
                    Categorizes customers based on spending patterns
                    Groups: High Spenders, Medium Spenders, Low Spenders
                    Analyzes average order value and total spending
                    Used for: Pricing strategies and promotional targeting

                    Category Preference ('category_preference')
                    Analyzes which product categories customers prefer
                    Identifies cross-selling opportunities
                    Shows category-specific buying patterns
                    Used for: Product recommendations and inventory planning

                    Overall Analysis ('overall')
                    Combines all above metrics
                    Provides comprehensive customer segmentation
                    Includes multiple data points for analysis
                    Used for: Strategic planning and marketing campaigns
                */
                enum: ['rfm', 'spending', 'category_preference', 'overall'],
                description: 'Type of segmentation analysis to perform',
                examples: ['rfm']
            },
            timeframe: {
                type: 'string',
                enum: ['30_days', '90_days', '180_days', '365_days'],
                description: 'Time period for analysis',
                default: '365_days'
            }
        },
        required: ['segmentationType']
    }
};

const calculateRFMScores = (orders) => {
    // Reference to add or subtract dates
    const now = new Date(); 
    const customerScores = {};
    /*  
        Create a scaffolding object with 
        Customer Id as key and an orders entry.
    */
    orders.forEach(order => {
        const customerId = order?.user?._id?.toString();
        if (!customerScores[customerId]) {
            customerScores[customerId] = {
                recency: 0,
                frequency: 0,
                monetary: 0,
                orders: []
            };
        }

        customerScores[customerId].orders.push({
            date: order.createdAt,
            amount: order.totalPrice
        });
    });

    // Calculate RFM scores
    /* 
        Fetch all customerIds (Keys from Object)
            For each key calculate values and enter back into the object
    */
    Object.keys(customerScores).forEach(customerId => {
        const customerData = customerScores[customerId];
        /* Sort the orders Array */
        const sortedOrders = customerData.orders.sort((a, b) => b.date - a.date);

        // Recency (days since last purchase)
        // (now - sortedOrders[0].date): Subtracts order date from current date - Returns milliseconds between dates 
        // (1000 * 60 * 60 * 24) - Total milli Seconds in 24 hours
        // Output: X (days)
        const recency = Math.floor((now - sortedOrders[0].date) / (1000 * 60 * 60 * 24));
        
        // Frequency (number of orders)
        const frequency = sortedOrders.length;
        
        // Monetary (total spend)
        const monetary = sortedOrders.reduce((sum, order) => sum + order.amount, 0);

        customerScores[customerId] = { recency, frequency, monetary };
    });

    return customerScores;
};

/* 
    RFM scores are needed to segment customers as well,
    Entire RFM Values for each customer is combined into 
    One single object for the entire customer base.
*/
const segmentCustomers = (rfmScores) => {
    const segments = {
        champions: [],
        loyalists: [],
        potential: [],
        at_risk: [],
        lost: []
    };
    //  Object.entries() method returns an array of key, value as strings.
    //  How did I come up with the numbers ?
    /*  
        RFM Segmentation Thresholds Explanation
        These numbers are typical RFM (Recency, Frequency, Monetary)
        segmentation thresholds based on e-commerce best practices.
        Threshold can be adjusted on Average order value, Purchase frequency patterns, Industry standards, Business goals, Customer lifecycle
    */
    Object.entries(rfmScores).forEach(([customerId, scores]) => {
        const { recency, frequency, monetary } = scores;

        // Segmentation logic
        if (recency <= 30 && frequency >= 10 && monetary >= 1000) {
            segments.champions.push(customerId);
        } else if (recency <= 90 && frequency >= 5) {
            segments.loyalists.push(customerId);
        } else if (recency <= 180 && frequency >= 2) {
            segments.potential.push(customerId);
        } else if (recency <= 365) {
            segments.at_risk.push(customerId);
        } else {
            segments.lost.push(customerId);
        }
    });

    return segments;
};

export const marketSegmentation = async (prompt) => {
    /* 
        Timeframe will be overwritten as per prompt, 365 days is the default value.
    */
    const { segmentationType, timeframe = '365_days' } = JSON.parse(prompt);
    
    try {
        // Calculate date range
        const endDate = new Date();
        // Returns: Current date/time (e.g., "2024-02-24T15:30:45.123Z")
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(timeframe.split("_")[0]));
        // Returns: Modified date object
        // Example with timeframe = '90_days':
        // If today is 2024-02-24, returns "2023-11-26T15:30:45.123Z"

        // Fetch orders within timeframe
        const orders = await Order.find({
            createdAt: { 
                $gte: startDate, 
                $lte: endDate 
            }
        }).populate('user', 'name email').lean();

        // Calculate RFM scores
        const rfmScores = calculateRFMScores(orders);
        
        // Segment customers
        const segments = segmentCustomers(rfmScores);

        // Generate segment statistics
        const stats = {
            totalCustomers: Object.keys(rfmScores).length,
            segmentCounts: {
                champions: segments.champions.length,
                loyalists: segments.loyalists.length,
                potential: segments.potential.length,
                at_risk: segments.at_risk.length,
                lost: segments.lost.length
            }
        };

        // Format response in markdown
        const analysis = `
### Market Segmentation Analysis
#### Time Period: ${timeframe}

#### Customer Segments Overview
- Total Customers: ${stats.totalCustomers}

#### Segment Distribution
1. **Champions (${stats.segmentCounts.champions})**
   - High-value, frequent buyers
   - ${((stats.segmentCounts.champions / stats.totalCustomers) * 100).toFixed(1)}% of customer base

2. **Loyalists (${stats.segmentCounts.loyalists})**
   - Regular customers
   - ${((stats.segmentCounts.loyalists / stats.totalCustomers) * 100).toFixed(1)}% of customer base

3. **Potential (${stats.segmentCounts.potential})**
   - Occasional buyers
   - ${((stats.segmentCounts.potential / stats.totalCustomers) * 100).toFixed(1)}% of customer base

4. **At Risk (${stats.segmentCounts.at_risk})**
   - Declining activity
   - ${((stats.segmentCounts.at_risk / stats.totalCustomers) * 100).toFixed(1)}% of customer base

5. **Lost (${stats.segmentCounts.lost})**
   - No recent purchases
   - ${((stats.segmentCounts.lost / stats.totalCustomers) * 100).toFixed(1)}% of customer base

#### Recommendations
1. Champions: Develop loyalty rewards
2. Loyalists: Increase engagement through personalized offers
3. Potential: Encourage more frequent purchases
4. At Risk: Re-engagement campaign needed
5. Lost: Win-back campaign with special offers
`;

        return analysis;

    } catch (error) {
        console.error('Segmentation Error:', error);
        throw new Error('Failed to perform market segmentation analysis');
    }
};