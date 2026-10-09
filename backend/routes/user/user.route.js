import express from "express";
import {
  changePassword,
  demoLogin,
  login,
  resetPassword,
  resetPasswordToken,
  sendotp,
  signup,
} from "../../controllers/auth/user.controller.js";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/sendotp", sendotp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/demo-login", demoLogin);
router.post("/changepassword", isAuthenticated, changePassword);
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

export default router;
