// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setIsAuthenticated, setUser } from '../features/authSlice';

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: String(process.env.REACT_APP_BACKEND_URL),
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
    }),
    updateAvatar: builder.mutation({
      query: (body) => ({
        url: `/me/update_avatar`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserDetailsQuery, useUpdateDetailsMutation, useUpdateAvatarMutation} = userApi;
