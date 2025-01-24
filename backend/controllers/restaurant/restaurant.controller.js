import { Restaurant } from "../../models/restaurant/restaurant.model.js";
import { User } from "../../models/user/user.model.js";
import { Menu } from "../../models/menu/menu.model.js";

import uploadImageToCloudinary from "../../utils/imageUploader.js";

// Create Restaurant
export const createRestaurant = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
    // validation
    if (!restaurantName || !city || !country || !deliveryTime || !cuisines) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the file is uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "Restaurant image is required",
      });
    }

    const existingRestaurant = await Restaurant.findOne({ user: userId });
    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant already exist for this user",
      });
    }

    // Handle image upload
    const uploadedImage = await uploadImageToCloudinary(
      req.files.image,
      process.env.FOLDER_NAME,
      1000, // height
      80 // quality as a percentage
    );

    if (!uploadedImage) {
      return res.status(500).json({
        success: false,
        message: "Error uploading image",
      });
    }

    // create restaurant
    const restaurant = await Restaurant.create({
      user: userId,
      restaurantName,
      city,
      country,
      deliveryTime,
      cuisines: JSON.parse(cuisines),
      imageUrl: uploadedImage.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant Added Successfully !",
      restaurant,
    });
  } catch (error) {
    console.error("Restaurant creation error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding restaurant",
      error: error.message,
    });
  }
};

// Get Restaurant
export const getRestaurant = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const restaurant = await Restaurant.findOne({ user: userId }).populate(
      "menus"
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        restaurant: [],
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant fetched successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while getting restaurant",
      error: error.message,
    });
  }
};

// Update Restaurant
export const updateRestaurant = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
    // validation
    if (!restaurantName || !city || !country || !deliveryTime || !cuisines) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the file is uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "Restaurant image is required",
      });
    }

    const existingRestaurant = await Restaurant.findOne({ user: userId });
    if (!existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    existingRestaurant.restaurantName = restaurantName;
    existingRestaurant.city = city;
    existingRestaurant.country = country;
    existingRestaurant.deliveryTime = deliveryTime;
    existingRestaurant.cuisines = JSON.parse(cuisines);

    // Handle image upload
    const uploadedImage = await uploadImageToCloudinary(
      req.files.image,
      process.env.FOLDER_NAME,
      1000, // height
      80 // quality as a percentage
    );

    if (!uploadedImage) {
      return res.status(500).json({
        success: false,
        message: "Error uploading image",
      });
    }

    existingRestaurant.image = uploadedImage.secure_url;
    await existingRestaurant.save();
    return res.status(200).json({
      success: true,
      message: "Restaurant Updated Successfully",
      restaurant: existingRestaurant,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating restaurant",
      error: error.message,
    });
  }
};
