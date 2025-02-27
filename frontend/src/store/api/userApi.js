// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setIsAuthenticated, setUser } from '../features/authSlice';

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  keepUnusedDataFor: 300, // Cache for 5 minutes
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_ENV === "production" ? process.env.REACT_APP_PROD_BACKEND_URL : process.env.REACT_APP_DEV_BACKEND_URL,
    // If you do not include credentials, Cookies will not be sent
    credentials: 'include',
  }),
  tagTypes: ['User'], // All the available tags within the API
  endpoints: (builder) => ({
    getUserDetails: builder.query({
      query: () => `/me`,
      /* {user : {}} -> user */
      // Runs before adding data into cache
      transformResponse: (response) => response.user,
      /* This function is triggered when the function runs */
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          // Checking if request is fulfilled
          const { data } = await queryFulfilled;
          // `onSuccess` side-effect
          dispatch(setUser(data));
          dispatch(setIsAuthenticated(true));
        } catch (err) {
          // `onError` side-effect
          console.error(err);
        }
      },
      providesTags: ['User'], // Tags to invalidate when this endpoint is used
    }),
    updateDetails: builder.mutation({
      query: (body) => ({
        url: `/me/update`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ["User"]
    }),
    updateAvatar: builder.mutation({
      query: (body) => ({
        url: `/me/update_avatar`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ["User"]
    }),
    getUsers: builder.query({
      query: () => ({
        url: `/admin/users`,
      }),
      providesTags: ['User'],
    }),
    getAdminUserDetails: builder.query({
      query: (id) => ({
        url: `/admin/users/${id}`,
      }),
      providesTags: ['User'],
    }),
    updateUserDetails: builder.mutation({
      query: ({id, body}) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ["User"]
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["User"]
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetUserDetailsQuery, useUpdateDetailsMutation, 
  useUpdateAvatarMutation, useGetUsersQuery, useGetAdminUserDetailsQuery,
  useUpdateUserDetailsMutation, useDeleteUserMutation}
= userApi;
