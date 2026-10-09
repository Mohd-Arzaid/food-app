import Stripe from "stripe";
import { Order } from "../../models/order/order.model.js";
import { Menu } from "../../models/menu/menu.model.js";
import { Restaurant } from "../../models/restaurant/restaurant.model.js";
import { User } from "../../models/user/user.model.js";

export const getOrders = async (req, res) => {
  try {
    // Restaurant owners use getOrderOverview, not this customer endpoint
    const requestingUser = await User.findById(req.user.id);
    if (requestingUser && requestingUser.isRestaurantOwner) {
      return res.status(403).json({
        success: false,
        message: "Restaurant owners cannot access customer order history",
      });
    }

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

    // Restaurant owners cannot place orders as customers
    const requestingUser = await User.findById(req.user.id);
    if (requestingUser && requestingUser.isRestaurantOwner) {
      return res.status(403).json({
        success: false,
        message: "Restaurant owners cannot place customer orders",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (restaurant.user.toString() === req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You cannot order from your own restaurant",
      });
    }

    // Real (non-demo) customers cannot checkout from a demo-owned restaurant
    if (requestingUser && !requestingUser.isDemo) {
      const restaurantOwner = await User.findById(restaurant.user);
      if (restaurantOwner && restaurantOwner.isDemo) {
        return res.status(403).json({
          success: false,
          message: "This restaurant is not available for ordering",
        });
      }
    }

    const deliveryDetails = checkoutSessionRequest.deliveryDetails || {};
    if (
      !deliveryDetails.address ||
      !deliveryDetails.city ||
      !deliveryDetails.country
    ) {
      return res.status(400).json({
        success: false,
        message: "Address, city, and country are required",
      });
    }

    const cartItems = checkoutSessionRequest.cartItems;
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const restaurantMenuIds = new Set(
      restaurant.menus.map((menuId) => menuId.toString())
    );
    if (cartItems.some((item) => !restaurantMenuIds.has(item.menuId))) {
      return res.status(400).json({
        success: false,
        message: "Some menu items do not belong to this restaurant.",
      });
    }

    for (const item of cartItems) {
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a positive whole number",
        });
      }
    }

    const menuItems = await Menu.find({
      _id: { $in: cartItems.map((item) => item.menuId) },
    });
    const menuById = new Map(
      menuItems.map((menu) => [menu._id.toString(), menu])
    );

    const trustedCartItems = [];
    for (const item of cartItems) {
      const menuItem = menuById.get(item.menuId);
      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message: "Some menu items are not available.",
        });
      }
      trustedCartItems.push({
        menuId: menuItem._id.toString(),
        name: menuItem.name,
        image: menuItem.imageUrl,
        price: menuItem.price,
        quantity: Number(item.quantity),
      });
    }

    const order = new Order({
      user: req.user.id,
      restaurant: restaurant._id,
      deliveryDetails,
      cartItems: trustedCartItems,
      status: "pending",
    });

    const lineItems = createLineItems(trustedCartItems, menuItems);

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

export const createLineItems = (cartItems, menuItems) => {
  const lineItems = cartItems
    .map((cartItem) => {
      const menuItem = menuItems.find(
        (item) => item._id.toString() === cartItem.menuId
      );
      if (!menuItem) {
        return null;
      }

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: menuItem.name,
            images: [menuItem.imageUrl],
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
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.WEBHOOK_ENDPOINT_SECRET
    );
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;
      const order = await Order.findById(session.metadata?.orderId);

      if (
        order &&
        session.payment_status === "paid" &&
        order.status === "pending"
      ) {
        if (session.amount_total) {
          order.totalAmount = session.amount_total;
        }
        order.status = "confirmed";
        await order.save();
      }
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

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
    const requestingUser = await User.findById(req.user.id);
    if (!requestingUser || !requestingUser.isRestaurantOwner) {
      return res.status(403).json({
        success: false,
        message: "Only restaurant owners can access order overview",
      });
    }

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

    const statusFlow = ["confirmed", "preparing", "outfordelivery", "delivered"];
    if (!statusFlow.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    if (order.status === "pending") {
      return res.status(400).json({
        success: false,
        message: "Order is not paid yet",
      });
    }

    const currentIndex = statusFlow.indexOf(order.status);
    const nextIndex = statusFlow.indexOf(status);
    if (nextIndex <= currentIndex) {
      return res.status(400).json({
        success: false,
        message: "Order status can only move forward",
      });
    }

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