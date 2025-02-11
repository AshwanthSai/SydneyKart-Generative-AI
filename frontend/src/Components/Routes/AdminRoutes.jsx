import React from "react";
import { Route } from "react-router-dom";
import ProtectedComponent from '../Auth/ProtectedComponent';
import Dashboard from "../Admin/Dashboard";
import ListProducts from "../Admin/ListProducts";
import NewProduct from "../Admin/NewProduct";
import UpdateProduct from "../Admin/UpdateProduct";
import UploadImages from "../Admin/UploadImages";
import ListOrders from "../Admin/ListOrders";
import ProcessingOrder from "../Admin/ProcessingOrder";
import ListUsers from "../Admin/ListUsers";
import UpdateUser from "../Admin/UpdateUser";
import ProductReviews from "../Admin/ProductReviews";


const useAdminRoutes = () => {
  return (
  <>
      <Route path = "/admin/dashboard" element={
         <ProtectedComponent admin={true}>
         <Dashboard />
        </ProtectedComponent>}
      />  
      <Route path = "/admin/products" element={
         <ProtectedComponent admin={true}>
            <ListProducts />
        </ProtectedComponent>}
      />  
      <Route path = "/admin/orders" element={
         <ProtectedComponent admin={true}>
            <ListOrders />
        </ProtectedComponent>}
      />  
      <Route path = "/admin/product/new" element={
         <ProtectedComponent admin={true}>
            <NewProduct />
        </ProtectedComponent>}
      />  
      <Route path = "/admin/products/:id" element={
         <ProtectedComponent admin={true}>
            <UpdateProduct />
        </ProtectedComponent>}
      />

        <Route path = "/admin/orders/:id" element={
         <ProtectedComponent admin={true}>
            <ProcessingOrder/>
        </ProtectedComponent>}
      />  
      <Route path = "/admin/products/:id/upload_images" element={
         <ProtectedComponent admin={true}>
            <UploadImages />
        </ProtectedComponent>}
      />  
      <Route path = "/admin/users" element={
         <ProtectedComponent admin={true}>
            <ListUsers />
        </ProtectedComponent>}
      />  
      <Route path = "/admin/reviews" element={
         <ProtectedComponent admin={true}>
            <ProductReviews />
        </ProtectedComponent>}
      />  
      <Route path = "/admin/user/:id" element={
         <ProtectedComponent admin={true}>
            <UpdateUser />
        </ProtectedComponent>}
      />  
  </>
  )
};

export default useAdminRoutes;
