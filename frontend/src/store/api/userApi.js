// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setIsAuthenticated, setUser } from "../features/authSlice"

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: String(process.env.REACT_APP_BACKEND_URL),
    // If you do not include credentials, Cookies will not be sent
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getUserDetails: builder.query({
      query: () => `/me`,
       /* {user : {}} -> user */
       // Runs before adding data into cache
       transformResponse: (response) => response.user,
       /* This functions is triggered when the function runs */
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          //Checking if request is fullfilled
          const { data } = await queryFulfilled
          // `onSuccess` side-effect
          console.log(data)
          dispatch(setUser(data))
          dispatch(setIsAuthenticated(true))
        } catch (err) {
          // `onError` side-effect
          console.error(err)
        }
      }
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserDetailsQuery } = userApi