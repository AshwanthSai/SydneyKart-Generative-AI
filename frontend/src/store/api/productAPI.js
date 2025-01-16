// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: String(process.env.REACT_APP_BACKEND_URL),
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
          url : "/products", 
          params : {
            page : params?.page,
            keyword : params?.keyword,
            /* Greater than min value, less than max value, (x,y) */
            "price[gte]": params?.min,
            "price[lte]": params?.max,
            category: params?.category,
            ratings: params?.ratings,
          }
        })
    }),
    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
    }),

  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetProductsQuery, useGetProductDetailsQuery} = productApi