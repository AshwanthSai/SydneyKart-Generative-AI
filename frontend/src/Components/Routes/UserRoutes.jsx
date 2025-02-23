import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import ProtectedComponent from '../Auth/ProtectedComponent';
import { Loader } from "../Layout/Loader";
import ErrorBoundary from '../Layout/ErrorBoundary';

// Eagerly loaded components
import Home from "../Home";
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import ProductDetails from '../Product/ProductDetails';  
import Profile from '../User/Profile';  

// Lazy loaded components
const UpdateProfile = lazy(() => import('../User/UpdateUser'));
const UploadAvatar = lazy(() => import('../User/UploadAvatar'));
const UpdatePassword = lazy(() => import('../User/UpdatePassword'));
const ForgotPassword = lazy(() => import('../Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../Auth/ResetPassword'));
const Cart = lazy(() => import('../Cart/Cart'));
const ShippingInfo = lazy(() => import('../Cart/ShippingInfo'));
const ConfirmOrder = lazy(() => import('../Cart/ConfirmOrder'));
const PaymentMethod = lazy(() => import('../Cart/PaymentMethod'));
const MyOrders = lazy(() => import('../Orders/MyOrders'));
const OrderDetails = lazy(() => import('../Orders/OrderDetails'));
const Invoice = lazy(() => import('../Invoice/Invoice'));

// Protected route wrapper with Suspense and ErrorBoundary
const ProtectedRoute = ({ children }) => (
  <ErrorBoundary>
    <ProtectedComponent>
      <Suspense fallback={<Loader />}>
        {children}
      </Suspense>
    </ProtectedComponent>
  </ErrorBoundary>
);

// Lazy route wrapper for non-protected routes
const LazyRoute = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<Loader />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

const UserRoutes = () => {
  return (
    <>
      {/* Eagerly loaded routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products/:id" element={
          <ProductDetails />
      }/>
      <Route path="/me/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* Lazy loaded public routes */}
      <Route path="/products/:id" element={
        <LazyRoute>
          <ProductDetails />
        </LazyRoute>
      } />
      <Route path="/password/forgot" element={
        <LazyRoute>
          <ForgotPassword />
        </LazyRoute>
      } />
      <Route path="/password/reset/:token" element={
        <LazyRoute>
          <ResetPassword />
        </LazyRoute>
      } />
      <Route path="/cart" element={
        <LazyRoute>
          <Cart />
        </LazyRoute>
      } />

      {/* Protected routes */}
      <Route path="/me/update_profile" element={
        <ProtectedRoute>
          <UpdateProfile />
        </ProtectedRoute>
      } />
      <Route path="/me/upload_avatar" element={
        <ProtectedRoute>
          <UploadAvatar />
        </ProtectedRoute>
      } />
      <Route path="/me/update_password" element={
        <ProtectedRoute>
          <UpdatePassword />
        </ProtectedRoute>
      } />
      <Route path="/shipping" element={
        <ProtectedRoute>
          <ShippingInfo />
        </ProtectedRoute>
      } />
      <Route path="/confirm_order" element={
        <ProtectedRoute>
          <ConfirmOrder />
        </ProtectedRoute>
      } />
      <Route path="/payment_method" element={
        <ProtectedRoute>
          <PaymentMethod />
        </ProtectedRoute>
      } />
      <Route path="/me/orders" element={
        <ProtectedRoute>
          <MyOrders />
        </ProtectedRoute>
      } />
      <Route path="/me/orders/:productId" element={
        <ProtectedRoute>
          <OrderDetails />
        </ProtectedRoute>
      } />
      <Route path="/invoice/order/:id" element={
        <ProtectedRoute>
          <Invoice />
        </ProtectedRoute>
      } />
    </>
  );
};

export default UserRoutes;