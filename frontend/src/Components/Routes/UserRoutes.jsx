import React from "react";
import ProductDetails from '../Product/ProductDetails';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import Profile from '../User/Profile';
import UpdateProfile from '../User/UpdateUser';
import ProtectedComponent from '../Auth/ProtectedComponent';
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
import { Route } from "react-router-dom";
import Home from "../Home"


const UserRoutes = () => {
  return (
    <>
      <Route path = "/" element={<Home />} />  
              <Route path = "/login" element={<Login />} />  
              <Route path = "/register" element={<Register />} />  
              <Route path = "/products/:id" element={<ProductDetails />} />  
              <Route path = "password/htmlForgot" element={<ForgotPassword />} />  
              <Route path = "password/reset/:token" element={<ResetPassword />} />  
              
              <Route path = "/me/profile" element={
                  <ProtectedComponent>
                    <Profile />
                  </ProtectedComponent>
                }
              />  
              <Route path = "/me/update_profile" element={
                 <ProtectedComponent>
                    <UpdateProfile />
                </ProtectedComponent>
              }/>  

              <Route path = "/me/upload_avatar" element={
                 <ProtectedComponent>
                    <UploadAvatar />
                </ProtectedComponent>
              }/>  

              <Route path = "/me/update_password" element={
                 <ProtectedComponent>
                    <UpdatePassword />
                </ProtectedComponent>
              }/>  

            <Route path = "/cart" element={
                    <Cart />
            }/>  

            <Route path = "/shipping" element={
                <ProtectedComponent>
                    <ShippingInfo />
                </ProtectedComponent>}
            />  

            <Route path = "/confirm_order" element={
                <ProtectedComponent>
                    <ConfirmOrder />
                </ProtectedComponent>}
            />  

            <Route path = "/payment_method" element={
                <ProtectedComponent>
                    <PaymentMethod />
                </ProtectedComponent>}
            />  

            <Route path = "/me/orders" element={
                <ProtectedComponent>
                    <MyOrders />
                </ProtectedComponent>}
            />  

            <Route path = "/me/orders/:productId" element={
                <ProtectedComponent>
                    <OrderDetails />
                </ProtectedComponent>}
            />  

            <Route path = "/invoice/order/:id" element={
                <ProtectedComponent>
                    <Invoice/>
                </ProtectedComponent>}
            />  

    </>
  )
};

export default UserRoutes;
