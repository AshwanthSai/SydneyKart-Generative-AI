import express from "express";
const router = express.Router();

import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
import { stripeCheckoutSession, stripeWebhook} from "../controllers/paymentController.js";

router.route("/payment/checkout_session").post(isAuthenticatedUser, stripeCheckoutSession);
router.route("/payment/webhook").post(stripeWebhook);

export default router;
