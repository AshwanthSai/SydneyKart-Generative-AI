import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return String(process.env.REACT_APP_PROD_BACKEND_URL);
  }
  return String(process.env.REACT_APP_DEV_BACKEND_URL);
};


// Define a service using a base URL and expected endpoints
export const orderAPI = createApi({
  reducerPath: 'orderAPI',
  keepUnusedDataFor: 300, // Cache for 5 minutes
  baseQuery: fetchBaseQuery({ 
    baseUrl: getBaseUrl(),
    credentials: 'include',
  }),
  tagTypes: ['Refetch Details', "Refetch List"],
  endpoints: (builder) => ({
    createNewOrder: builder.mutation({
      query: (body) => ({
        url: `/orders/new`,
        method: 'POST',
        body,
      }),
    }),
    stripeCheckoutSession: builder.mutation({
      query: (body) => ({
        url: `/payment/checkout_session`,
        method: 'POST',
        body,
      }),
    }),
    myOrders: builder.query({
      query: () => `/me/orders`,
    }),
    orderDetails: builder.query({
      query: (id) => `/orders/${id}`,  
      providesTags: ['Refetch Details']
    }),
    submitReview: builder.mutation({
      query: (body) => ({
        url: `/reviews`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Refetch Details'],
    }),
    getSales: builder.query({
      query: ({startDate, endDate}) => `/admin/get_sales?startDate=${startDate}&endDate=${endDate}`,  
    }),
    getOrders: builder.query({
      query: () => `/admin/orders`,  
      providesTags: ['Refetch List']
    }),
    updateOrderStatus: builder.mutation({
      query: ({id, body}) => ({
        url: `/admin/orders/${id}`,
        method: 'PUT',
        body,
      }),
      providesTags: ['Refetch Details']
    }),
    deleteOrder: builder.mutation({
      query: ({id}) => ({
        url: `/admin/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Refetch List']
    }),
  }),
})




// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useCreateNewOrderMutation, useStripeCheckoutSessionMutation,
              useMyOrdersQuery, useOrderDetailsQuery, useSubmitReviewMutation, useLazyGetSalesQuery,
              useGetOrdersQuery, useUpdateOrderStatusMutation, useDeleteOrderMutation,
            } = orderAPI