import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const orderAPI = createApi({
  reducerPath: 'orderAPI',
  baseQuery: fetchBaseQuery({ 
    baseUrl: String(process.env.REACT_APP_BACKEND_URL),
    credentials: 'include',
  }),
  tagTypes: ['Refetch Reviews'],
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
      providesTags: ['Refetch Reviews']
    }),
    submitReview: builder.mutation({
      query: (body) => ({
        url: `/reviews`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Refetch Reviews'],
    }),
    getSales: builder.query({
      query: ({startDate, endDate}) => `/admin/get_sales?startDate=${startDate}&endDate=${endDate}`,  
    }),
  }),
})



// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useCreateNewOrderMutation, useStripeCheckoutSessionMutation,
              useMyOrdersQuery, useOrderDetailsQuery, useSubmitReviewMutation, useLazyGetSalesQuery
            } = orderAPI