import express from "express";
//Import all Controllers
import {getProductDetails, getProducts, newProduct, updateProduct, deleteProduct, createProductReview, getProductReviews, deleteProductReview} from "../controller/productsController.js";
import {isAuthenticatedUser, authorizeRoles} from "../middlewares/auth.js";

const router = express.Router()

//isAuthenticated Middleware will add user object to req, if authenticated.
router.route("/products").get(getProducts)
router.route("/products/:id").get(getProductDetails)
router.route("/admin/products").post(isAuthenticatedUser,authorizeRoles("admin"), newProduct)
router.route("/admin/products/:id").put(isAuthenticatedUser,authorizeRoles("admin"), updateProduct)
router.route("/admin/products/:id").delete(isAuthenticatedUser,authorizeRoles("admin"), deleteProduct)
router.route("/reviews")
.get(isAuthenticatedUser,getProductReviews)
.put(isAuthenticatedUser,createProductReview)

router.route("/admin/reviews")
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProductReview)

export default router;