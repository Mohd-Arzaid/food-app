import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: false,
      default: "Update your address",
    },
    city: {
      type: String,
      required: false,
      default: "Update your city",
    },
    country: {
      type: String,
      required: false,
      default: "Update your country",
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
