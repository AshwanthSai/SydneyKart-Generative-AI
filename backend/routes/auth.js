import express from "express";
import {registerUser,loginUser,logoutUser} from "../controller/authControllers.js"

const router = express.Router()
/* Create a /register endpoint and Match get requests with getProducts function*/
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)


export default router;
