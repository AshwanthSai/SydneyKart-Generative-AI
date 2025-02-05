// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: String(process.env.REACT_APP_BACKEND_URL),
    credentials: 'include',
  }),
  tagTypes: ["AdminProducts", "Products", "SpecificProduct"],
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
        }),
        providesTags: ["Products"],
    }),
    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["SpecificProduct"],
    }),
    getAdminProducts: builder.query({
      query: () => `/admin/products`,
      providesTags: ["AdminProducts"],
    }),
    canUserReviewOrder: builder.query({
      query: (id) => `/can_review?productId=${id}`,
    }),
    newProduct: builder.mutation({
      query: (body) => ({
        url: `/admin/products`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AdminProducts', "Products", "SpecificProduct"],
    }),
    updateProduct: builder.mutation({
      query: ({id, product}) => ({
        url: `/admin/products/${id}`,
        method: 'PUT',
        body : product,
      }),
      invalidatesTags: ['AdminProducts', "Products", "SpecificProduct"],
    }),
  })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetProductsQuery, useGetProductDetailsQuery,
   useCanUserReviewOrderQuery, useGetAdminProductsQuery,
  useNewProductMutation, useUpdateProductMutation} = productApi