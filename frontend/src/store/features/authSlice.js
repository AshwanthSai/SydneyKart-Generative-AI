import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading : false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
        state.user = action.payload
    },
    setIsAuthenticated: (state, action) => {
        state.isAuthenticated = action.payload
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    }
  }})

// Action creators are generated for each case reducer function
export const { setUser, setIsAuthenticated, setIsLoading} = authSlice.actions
export default authSlice.reducer