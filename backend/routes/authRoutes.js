import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyEmailGET,
  verifyEmailPOST,
  resendVerificationEmail,
} from "../controllers/authController.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email", verifyEmailGET);
router.post("/verify-email", verifyEmailPOST);
router.post("/resend-verification", resendVerificationEmail);

export default router;
