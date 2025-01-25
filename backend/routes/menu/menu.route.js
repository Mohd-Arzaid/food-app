import express from "express";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";
import { addMenu, editMenu } from "../../controllers/menu/menu.controller.js";

const router = express.Router();

router.post("/createMenu", isAuthenticated, addMenu);
router.put("/editMenu/:id", isAuthenticated,editMenu);

export default router;
