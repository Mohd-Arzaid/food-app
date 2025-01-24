import express from "express";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";
import { deleteAccount, getUserDetails, updateProfile } from "../../controllers/profile/profile.controller.js";

const router = express.Router();

router.put("/updateProfile", isAuthenticated, updateProfile);
router.get("/getUserDetails", isAuthenticated, getUserDetails);
router.delete("/deleteAccount", isAuthenticated, deleteAccount);


export default router;
