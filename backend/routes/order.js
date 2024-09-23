import express from "express";
import { createOrder, getOrderDetails,myOrders, getAllOrders, updateOrder} from "../controller/orderControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router()
router.route(`/orders/new`).post(isAuthenticatedUser, createOrder)
router.route(`/orders/:id`).get(isAuthenticatedUser, getOrderDetails)
router.route(`/me/orders`).get(isAuthenticatedUser, myOrders)
router.route(`/admin/orders`).get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders)
router.route(`/admin/orders/:id`).post(isAuthenticatedUser, authorizeRoles("admin"),updateOrder)


/* 
Export default with same name, but import with a different name
*/
export default router;