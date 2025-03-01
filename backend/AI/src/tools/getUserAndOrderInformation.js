import Order from '../../../models/order.js';
import User from '../../../models/user.js';

export const getUserAndOrderInformationDefinition = {
    name: 'getUserAndOrderInformation',
    description: 'Get detailed user information based on ID, name, or email',
    parameters: {
      type: 'object',
      properties: {
        searchQuery: {
          type: 'string',
          description: 'User ID, name, or email to search for',
          examples: ['john@example.com', 'John Doe', '507f1f77bcf86cd799439011']
        },
        searchType: {
          type: 'string',
          enum: ['id', 'name', 'email'],
          description: 'Type of search query provided',
          default: 'email'
        },
        infoType: {
          type: 'string',
          enum: ['full', 'basic', 'address', 'orders', 'preferences'],
          description: 'Type of user information to retrieve',
          default: 'basic'
        }
      },
      required: ['searchQuery']
    }
};

export const getUserAndOrderInformation = async (prompt, socket) => {
    if(socket?.user?.isAdmin === false) {
        return "You do not have an Admin role to perform this action, Kindly log in with the correct credentials"
    }
    const parameters = JSON.parse(prompt);
    const { searchQuery, searchType = 'email', infoType = 'basic' } = parameters;

    try {
        // 1. Build search query based on searchType
        let searchCriteria = {};
        
        switch (searchType) {
            case 'id':
                searchCriteria._id = searchQuery;
                break;
            case 'email':
                searchCriteria.email = searchQuery;
                break;
            case 'name':
                searchCriteria.name = { $regex: new RegExp(searchQuery, 'i') };
                break;
            default:
                throw new Error('Invalid search type');
        }

        // 2. Find user with search criteria
        let user = await User.findOne(searchCriteria).select('-password').lean()
        let orders = await Order.find({ user: user?._id }).lean();
        user["orders"] = orders;

        if (!user) {
            throw new Error(`User not found with ${searchType}: ${searchQuery}`);
        }

        // 3. Format response based on infoType
        const response = {
            basic: {
                name: user.name,
                email: user.email,
                avatar: user.avatar?.url,
                role: user.role,
                createdAt: user.createdAt
            },
            address: {
                shippingAddress: user.shippingAddress || {},
                billingAddress: user.billingAddress || {}
            },
            preferences: {
                notifications: user.preferences?.notifications || {},
                language: user.preferences?.language || 'en',
                currency: user.preferences?.currency || 'USD'
            },
            orders : user.orders.map(order => {
                return {
                    _id: order._id,
                    products: order.orderItems,
                    total: order.totalAmount,
                    createdAt: order.createdAt,
                    paymentMethod: order.paymentMethod,
                }
            })
        };

        // Return specific information or full user details
        const result = infoType === 'full' ? 
            { 
                ...response.basic,
                ...response.address,
                orders: response.orders,
                preferences: response.preferences
            } : 
            response[infoType] || response.basic;

        return JSON.stringify(result, null, 2);
    } catch (error) {
        console.error('Error retrieving user information:', error.message);
        throw error;
    }
};