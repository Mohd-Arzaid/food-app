import express from "express";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";
import { addMenu } from "../../controllers/menu/menu.controller.js";

const router = express.Router();

router.post("/createMenu", isAuthenticated, addMenu);

export default router;
