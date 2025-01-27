import express from "express";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";
import { createCheckoutSession, getOrderOverview, getOrders, stripeWebhook, updateOrderStatus } from "../../controllers/order/order.controller.js";

const router = express.Router();

router.get("/getOrders", isAuthenticated, getOrders);
router.post("/checkout/create-checkout-session", isAuthenticated, createCheckoutSession);
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook
  );

// Route to fetch order overview for the authenticated user
router.get("/order-overview", isAuthenticated, getOrderOverview);
  
// Route to update the status of an order
router.put("/update-order-status/:orderId", isAuthenticated, updateOrderStatus);


export default router;
