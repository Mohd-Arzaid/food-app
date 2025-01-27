import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // restaurant: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Restaurant",
    //   required: true,
    // },
    deliveryDetails: {
      email: {
        type: String,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true, 
      },
    },

    cartItems: [
      {
        menuId: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "outfordelivery",
        "delivered",
      ],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
