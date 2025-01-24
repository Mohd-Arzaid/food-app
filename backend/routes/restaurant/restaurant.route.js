import express from "express";
import { createRestaurant, getRestaurant, updateRestaurant } from "../../controllers/restaurant/restaurant.controller.js";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/createRestaurant", isAuthenticated, createRestaurant);
router.get("/getRestaurant", isAuthenticated, getRestaurant);
router.put("/updateRestaurant", isAuthenticated, updateRestaurant);

export default router;
