import express from "express";
//Import all Controllers
import {getProductDetails, getProducts, newProduct, updateProduct, deleteProduct} from "../controller/productsController.js";

const router = express.Router()
router.route("/products").get(getProducts)
router.route("/products/:id").get(getProductDetails)
router.route("/admin/products").post(newProduct)
router.route("/products/:id").put(updateProduct)
router.route("/products/:id").delete(deleteProduct)

export default router;