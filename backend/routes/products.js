import express from "express";
//Import all Controllers
import {getProducts, newProduct} from "../controller/productsController.js";

const router = express.Router()
router.route("/products").get(getProducts)
router.route("/admin/products").post(newProduct)

export default router;