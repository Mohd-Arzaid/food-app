import express from "express";
import { createRestaurant, deleteRestaurant, getRestaurant, getSingleRestaurant, searchRestaurant, updateRestaurant } from "../../controllers/restaurant/restaurant.controller.js";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/createRestaurant", isAuthenticated, createRestaurant);
router.get("/getRestaurant", isAuthenticated, getRestaurant);
router.put("/updateRestaurant", isAuthenticated, updateRestaurant);
router.delete("/deleteRestaurant", isAuthenticated, deleteRestaurant);
router.get("/searchRestaurant/:searchText?", isAuthenticated, searchRestaurant);
router.get("/getSingleRestaurant/:id", isAuthenticated, getSingleRestaurant);
export default router;
