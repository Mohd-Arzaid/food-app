import express from "express";
import { createRestaurant } from "../../controllers/restaurant/restaurant.controller.js";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/createRestaurant", isAuthenticated, createRestaurant);

export default router;
