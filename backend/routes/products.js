import express from "express";
//Import all Controllers
import {getProducts} from "../controller/productsController.js";

const router = express.Router()
router.route("/products").get(getProducts)

export default router;