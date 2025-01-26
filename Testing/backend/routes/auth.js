import express from "express";
import {registerUser,loginUser,logoutUser,forgotPassword,resetPassword, getUserProfile,updatePassword, updateDetails, getAllUsers, getUserDetails, updateUser,deleteUser} from "../controller/authControllers.js"
import {isAuthenticatedUser,authorizeRoles} from "../middlewares/auth.js"

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/password/forgot").post(forgotPassword)
// Note - resetting the password is a put operation

router.route("/password/reset/:resetToken").put(resetPassword)
router.route("/me").get(isAuthenticatedUser,getUserProfile)
router.route("/password/update").put(isAuthenticatedUser,updatePassword)
router.route("/me/update").put(isAuthenticatedUser,updateDetails)

router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers)

/* Note how we have chained the http methods */
router.route("/admin/users/:id")
.get(isAuthenticatedUser,authorizeRoles("admin"),getUserDetails)
.patch(isAuthenticatedUser,authorizeRoles("admin"),updateUser)
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser)

export default router;
