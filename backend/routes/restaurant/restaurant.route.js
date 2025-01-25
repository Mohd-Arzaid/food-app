import express from "express";
import { createRestaurant, getRestaurant, searchRestaurant, updateRestaurant } from "../../controllers/restaurant/restaurant.controller.js";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/createRestaurant", isAuthenticated, createRestaurant);
router.get("/getRestaurant", isAuthenticated, getRestaurant);
router.put("/updateRestaurant", isAuthenticated, updateRestaurant);
router.get("/searchRestaurant/:searchText?",isAuthenticated, searchRestaurant);

export default router;
