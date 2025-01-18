import { configureStore } from '@reduxjs/toolkit'
import { productApi } from '../store/api/productAPI'
import { authApi } from '../store/api/authAPI';
import { userApi } from '../store/api/userApi';
import authReducer from '../store/features/authSlice';
import cartReducer from './features/cartSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        [productApi.reducerPath]: productApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(productApi.middleware, authApi.middleware, userApi.middleware),
});

export default store;