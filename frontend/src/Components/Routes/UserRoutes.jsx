import React from "react";
import { Route } from "react-router-dom";
import ProtectedComponent from '../Auth/ProtectedComponent';
import ErrorBoundary from '../Layout/ErrorBoundary';

// Import all components eagerly
import Home from "../Home";
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import ProductDetails from '../Product/ProductDetails';
import Profile from '../User/Profile';
import UpdateProfile from '../User/UpdateUser';
import UploadAvatar from '../User/UploadAvatar';
import UpdatePassword from '../User/UpdatePassword';
import ForgotPassword from '../Auth/ForgotPassword';
import ResetPassword from '../Auth/ResetPassword';
import Cart from '../Cart/Cart';
import ShippingInfo from '../Cart/ShippingInfo';
import ConfirmOrder from '../Cart/ConfirmOrder';
import PaymentMethod from '../Cart/PaymentMethod';
import MyOrders from '../Orders/MyOrders';
import OrderDetails from '../Orders/OrderDetails';
import Invoice from '../Invoice/Invoice';

// Protected route wrapper with ErrorBoundary
const ProtectedRoute = ({ children }) => (
  <ErrorBoundary>
    <ProtectedComponent>
      {children}
    </ProtectedComponent>
  </ErrorBoundary>
);

const UserRoutes = () => {
  return (
    <>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/password/forgot" element={<ForgotPassword />} />
      <Route path="/password/reset/:token" element={<ResetPassword />} />
      <Route path="/cart" element={<Cart />} />

      {/* Protected routes */}
      <Route path="/me/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
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