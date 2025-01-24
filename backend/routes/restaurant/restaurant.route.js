import express from "express";
import { createRestaurant, getRestaurant } from "../../controllers/restaurant/restaurant.controller.js";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/createRestaurant", isAuthenticated, createRestaurant);
router.get("/getRestaurant", isAuthenticated, getRestaurant);

export default router;
