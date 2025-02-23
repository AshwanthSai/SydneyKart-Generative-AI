import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import ProtectedComponent from '../Auth/ProtectedComponent';
import ErrorBoundary from '../Layout/ErrorBoundary';
import { Loader } from "../Layout/Loader";

// Lazy load all admin components
const Dashboard = lazy(() => import("../Admin/Dashboard"));
const ListProducts = lazy(() => import("../Admin/ListProducts"));
const NewProduct = lazy(() => import("../Admin/NewProduct"));
const UpdateProduct = lazy(() => import("../Admin/UpdateProduct"));
const UploadImages = lazy(() => import("../Admin/UploadImages"));
const ListOrders = lazy(() => import("../Admin/ListOrders"));
const ProcessingOrder = lazy(() => import("../Admin/ProcessingOrder"));
const ListUsers = lazy(() => import("../Admin/ListUsers"));
const UpdateUser = lazy(() => import("../Admin/UpdateUser"));
const ProductReviews = lazy(() => import("../Admin/ProductReviews"));

// Admin route wrapper component
const AdminRoute = ({ children }) => (
  <ErrorBoundary>
    <ProtectedComponent admin={true}>
      <Suspense fallback={<Loader />}>
        {children}
      </Suspense>
    </ProtectedComponent>
  </ErrorBoundary>
);

const useAdminRoutes = () => {
  return (
    <>
      <Route 
        path="/admin/dashboard" 
        element={<AdminRoute><Dashboard /></AdminRoute>}
      />
      
      <Route 
        path="/admin/products" 
        element={<AdminRoute><ListProducts /></AdminRoute>}
      />
      
      <Route 
        path="/admin/orders" 
        element={<AdminRoute><ListOrders /></AdminRoute>}
      />
      
      <Route 
        path="/admin/product/new" 
        element={<AdminRoute><NewProduct /></AdminRoute>}
      />
      
      <Route 
        path="/admin/products/:id" 
        element={<AdminRoute><UpdateProduct /></AdminRoute>}
      />
      
      <Route 
        path="/admin/orders/:id" 
        element={<AdminRoute><ProcessingOrder /></AdminRoute>}
      />
      
      <Route 
        path="/admin/products/:id/upload_images" 
        element={<AdminRoute><UploadImages /></AdminRoute>}
      />
      
      <Route 
        path="/admin/users" 
        element={<AdminRoute><ListUsers /></AdminRoute>}
      />
      
      <Route 
        path="/admin/reviews" 
        element={<AdminRoute><ProductReviews /></AdminRoute>}
      />
      
      <Route 
        path="/admin/user/:id" 
        element={<AdminRoute><UpdateUser /></AdminRoute>}
      />
    </>
  );
};

export default useAdminRoutes;