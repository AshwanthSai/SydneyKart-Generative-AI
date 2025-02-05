import React from "react";
import { Route } from "react-router-dom";
import ProtectedComponent from '../Auth/ProtectedComponent';
import Dashboard from "../Admin/Dashboard";
import ListProducts from "../Admin/ListOrders";
import NewProduct from "../Admin/NewProduct";
import UpdateProduct from "../Admin/UpdateProduct";
import UploadImages from "../Admin/UploadImages";


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
      <Route path = "//admin/products/:id/upload_images" element={
         <ProtectedComponent admin={true}>
            <UploadImages />
        </ProtectedComponent>}
      />  
  </>
  )
};

export default useAdminRoutes;
