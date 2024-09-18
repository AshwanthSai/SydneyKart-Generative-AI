import express from "express";
import {registerUser,loginUser} from "../controller/authControllers.js"

const router = express.Router()
/* Create a /register endpoint and Match get requests with getProducts function*/
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)


export default router;
