// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return String(process.env.REACT_APP_PROD_BACKEND_URL);
  }
  return String(process.env.REACT_APP_DEV_BACKEND_URL);
};


// Define a service using a base URL and expected endpoints
export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: getBaseUrl(),
    credentials: 'include',
  }),
  keepUnusedDataFor: 300, // Cache for 5 minutes
  tagTypes: ["AdminProducts", "Products", "SpecificProduct", "Reviews"],
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
    productUploadImage: builder.mutation({
      query: ({id, uploadImages}) => ({
        url: `/admin/products/${id}/upload_images`,
        method: 'PUT',
        body : {images : uploadImages},
      }),
      invalidatesTags: ['AdminProducts', "Products", "SpecificProduct"],
    }),
    deleteProductImage: builder.mutation({
      query: ({id, imgId}) => ({
        url: `/admin/products/${id}/delete_images`,
        method: 'PUT',
        body : {imgId},
      }),
      invalidatesTags: ['AdminProducts', "Products", "SpecificProduct"],
    }),
    deleteProduct: builder.mutation({
      query: ({id}) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminProducts', "Products", "SpecificProduct"],
    }),
    getReviews: builder.query({
      query: (id) => `/reviews?id=${id}`,
      providesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation({
      query: ({id, productId}) => ({ 
        url : `/admin/reviews?id=${id}&productId=${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Reviews", "Products", "SpecificProduct", "AdminProducts"],
    }),
    ProductRecommendations: builder.mutation({
      query: ({product}) => ({
        url: `/product/recommendations`,
        method: 'POST',
        body : {product},
      }),
      transformResponse: (response) => {
        return response.results.map(item => ({
          id: item.id,
          score: item.score,
          // Spread metadata properties to root level
          ...item.metadata,
          // Transform images to use first image as main
          image: item.metadata.images[0]?.url || '',
          images: item.metadata.images,
          // Format price
          price: Number(item.metadata.price).toFixed(2),
          // Add computed properties if needed
          inStock: item.metadata.stock > 0,
          formattedDate: new Date().toLocaleDateString(),
        }));
      },
    })
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetProductsQuery, useGetProductDetailsQuery,
   useCanUserReviewOrderQuery, useGetAdminProductsQuery,
  useNewProductMutation, useUpdateProductMutation,
  useProductUploadImageMutation, useDeleteProductImageMutation,
  useDeleteProductMutation, useLazyGetReviewsQuery, useDeleteReviewMutation,
  useProductRecommendationsMutation,
} = productApi