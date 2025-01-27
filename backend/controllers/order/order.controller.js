import Stripe from "stripe";
import { Order } from "../../models/order/order.model.js";
import { Menu } from "../../models/menu/menu.model.js";
import { User } from "../../models/user/user.model.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("user");
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "An error occurred while fetching orders.",
    });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const checkoutSessionRequest = req.body;

    // Fetch all menu items from the database based on cart items
    const menuItems = await Menu.find({
      _id: { $in: checkoutSessionRequest.cartItems.map((item) => item.menuId) },
    });

    // Log menuItems to debug
    // console.log("Available menu items:", menuItems);
    // console.log("Requested cart items:", checkoutSessionRequest.cartItems);

    // Validate if all cart items are found
    if (menuItems.length !== checkoutSessionRequest.cartItems.length) {
      return res.status(400).json({
        success: false,
        message: "Some menu items are not available.",
      });
    }

    const order = new Order({
      user: req.user.id,
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      status: "pending",
    });

    //line items
    const lineItems = createLineItems(checkoutSessionRequest, menuItems);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // console.log("stripe : ", process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["GB", "US", "CA"],
      },
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order/status`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: order._id.toString(),
        images: JSON.stringify(menuItems.map((item) => item.image)),
      },
    });

    if (!session.url) {
      return res.status(400).json({
        success: false,
        error: error.message,
        message: "Error while creating session",
      });
    }

    await order.save();
    return res.status(200).json({
      success: true,
      message: "Checkout session created successfully",
      session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "An error occurred while creating the checkout session.",
    });
  }
};

export const createLineItems = (checkoutSessionRequest, menuItems) => {
  // 1. create line items
  const lineItems = checkoutSessionRequest.cartItems
    .map((cartItem) => {
      const menuItem = menuItems.find(
        (item) => item._id.toString() === cartItem.menuId
      );
      if (!menuItem) {
        console.error(`Menu item not found for menuId: ${cartItem.menuId}`);
        return null; // Skip this item
      }

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: menuItem.name,
            images: [menuItem.imageUrl], // Use imageUrl instead of image
          },
          unit_amount: menuItem.price * 100,
        },
        quantity: cartItem.quantity,
      };
    })
    .filter((item) => item !== null);

  // 2. return lineItems
  return lineItems;
};

export const stripeWebhook = async (req, res) => {
  let event;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const signature = req.headers["stripe-signature"];

    // Construct the payload string for verification
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    // Generate test header string for event construction
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    // Construct the event using the payload string and header

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;
      const order = await Order.findById(session.metadata?.orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Update the order with the amount and status
      if (session.amount_total) {
        order.totalAmount = session.amount_total;
      }
      order.status = "confirmed";

      await order.save();
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  // Send a 200 response to acknowledge receipt of the event
  res.status(200).send();
};

// Get Restaurant Order
export const getOrderOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

     // Fetch all orders for the user
     const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "An error occurred while fetching orders.",
    });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update the order status
    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      status: order.status,
      message: "Order status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "An error occurred while updating the order status.",
    });
  }
};