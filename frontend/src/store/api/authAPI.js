// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {userApi} from "../api/userApi"
import { setIsAuthenticated, setUser } from '../features/authSlice'


/* 
    Mutations are used to send data updates to the server 
    and apply the changes to the local cache. 
    Mutations can also invalidate cached data and force re-fetches.
*/
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.REACT_APP_ENV === "production" ? process.env.REACT_APP_PROD_BACKEND_URL : process.env.REACT_APP_DEV_BACKEND_URL,
    /* 
      "credentials" tells fetch or RTK Query how to handle HTTP cookies.
      By default, browsers omit credentials on cross-site requests.
      If "credentials" is set to "include," cookies and other credentials will be sent.
    */
    credentials: 'include',  // Include cookies in the request
   }),
  endpoints: (build) => ({
    /*
      - Notice, we are passing body as a parameter.
    */
    login: build.mutation({
      query: (body) => ({
        url: `/login`,
        method: 'POST',
        body,
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
        //Checking if request is fullfilled
        await queryFulfilled
        // `onSuccess` side-effect

        await dispatch(setIsAuthenticated(true));
        // Then fetch user details
        try {
          await dispatch(userApi.endpoints.getUserDetails.initiate(null));
        } catch (userError) {
          console.error('Failed to fetch user details:', userError);
          // Optionally reset auth state if user details fetch fails
          await dispatch(setIsAuthenticated(false));
        }
        } catch (err) {
          console.log("Something Wrong")
          // `onError` side-effect
          console.error(err)
        }
      }
    }),
    register: build.mutation({
      query: (body) => ({
        url: `/register`,
        method: 'POST',
        body,
    }),
    async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          //Checking if request is fulfilled
          await queryFulfilled
          // `onSuccess` side-effect
          await dispatch(userApi.endpoints.getUserDetails.initiate(null))
        } catch (err) {
          // `onError` side-effect
          console.error(err)
        }
      }
    }),
    logout: build.query({
      query: () => `/logout`,
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          //Checking if request is fullfilled
          await queryFulfilled
          // `onSuccess` side-effect
          await dispatch(setUser(null))
          await dispatch(setIsAuthenticated(false))
          await dispatch(authApi.util.resetApiState());
        } catch (err) {
          // `onError` side-effect
          console.error(err)
        }
      }
    }),
    updatePassword: build.mutation({
      query: (body) => ({
        url: `/password/update`,
        method: 'PUT',
        body,
      })
   }),
   forgotPassword: build.mutation({
      query: (body) => ({
        url: `/password/forgot`,
        method: 'POST',
        body,
      })
   }),
   resetPassword: build.mutation({
    query: ({token, body}) => ({
      url: `/password/reset/${token}`,
      method: 'PUT',
      body: body
    })
  }),
  })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useRegisterMutation,
               useLazyLogoutQuery, useUpdatePasswordMutation,
               useForgotPasswordMutation, useResetPasswordMutation
              } = authApi  