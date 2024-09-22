import express from "express";
import { createOrder, getOrderDetails,myOrders} from "../controller/orderControllers.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router()
router.route(`/orders/new`).post(isAuthenticatedUser, createOrder)
router.route(`/orders/:id`).get(isAuthenticatedUser, getOrderDetails)
router.route(`/orders/:id`).get(isAuthenticatedUser, getOrderDetails)
router.route(`/me/orders`).get(isAuthenticatedUser, myOrders)


/* 
Export default with same name, but import with a different name
*/
export default router;