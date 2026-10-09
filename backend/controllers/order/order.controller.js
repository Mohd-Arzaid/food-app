import Stripe from "stripe";
import { Order } from "../../models/order/order.model.js";
import { Menu } from "../../models/menu/menu.model.js";
import { Restaurant } from "../../models/restaurant/restaurant.model.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("user", "-password -resetPasswordToken -resetPasswordExpires");
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
    const { restaurantId } = checkoutSessionRequest;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Restaurant is required",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const restaurantMenuIds = new Set(
      restaurant.menus.map((menuId) => menuId.toString())
    );
    const cartMenuIds = checkoutSessionRequest.cartItems.map(
      (item) => item.menuId
    );
    if (cartMenuIds.some((menuId) => !restaurantMenuIds.has(menuId))) {
      return res.status(400).json({
        success: false,
        message: "Some menu items do not belong to this restaurant.",
      });
    }

    // Fetch all menu items from the database based on cart items
    const menuItems = await Menu.find({
      _id: { $in: cartMenuIds },
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
      restaurant: restaurant._id,
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
      success_url: `${process.env.FRONTEND_URL}/order/status?session_id={CHECKOUT_SESSION_ID}`,
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

export const confirmPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session id is required",
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const order = await Order.findById(session.metadata?.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Order does not belong to this user",
      });
    }

    if (session.payment_status !== "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment is not completed yet",
        status: order.status,
      });
    }

    if (session.amount_total) {
      order.totalAmount = session.amount_total;
    }
    if (order.status === "pending") {
      order.status = "confirmed";
    }
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order confirmed successfully",
      status: order.status,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "An error occurred while confirming the payment.",
    });
  }
};

// Get Restaurant Order
export const getOrderOverview = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.user.id });
    if (!restaurant) {
      return res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        orders: [],
      });
    }

    const orders = await Order.find({ restaurant: restaurant._id }).sort({
      createdAt: -1,
    });

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

    const restaurant = await Restaurant.findOne({ user: req.user.id });
    if (
      !restaurant ||
      !order.restaurant ||
      order.restaurant.toString() !== restaurant._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the restaurant owner can update this order",
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