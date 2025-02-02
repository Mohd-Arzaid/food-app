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

    // Handle image upload (optional)
    if (req.files && req.files.image) {
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
    }
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

// Search Restaurant
export const searchRestaurant = async (req, res) => {
  try {
    const searchText = req.params.searchText || "";
    const searchQuery = req.query.searchQuery || "";
    const selectedCuisines = (req.query.selectedCuisines || "")
      .split(",")
      .filter((cuisine) => cuisine);

    // Initial empty query object
    const query = {};

    if (searchText) {
      query.$or = [
        { restaurantName: { $regex: searchText, $options: "i" } },
        { city: { $regex: searchText, $options: "i" } },
        { country: { $regex: searchText, $options: "i" } },
      ];
    }

    // filter on the basis of searchQuery
    if (searchQuery) {
      query.$or = [
        { restaurantName: { $regex: searchQuery, $options: "i" } },
        { cuisines: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Filter on the basis of selectedCuisines
    if (selectedCuisines.length > 0) {
      query.cuisines = { $in: selectedCuisines };
    }

    const restaurants = await Restaurant.find(query);
    return res.status(200).json({
      success: true,
      message: "Restaurant fetched successfully",
      restaurants,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while searching restaurant",
      error: error.message,
    });
  }
};

// Get Restaurant by ID
export const getSingleRestaurant = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const restaurantId = req.params.id;

    // Find the restaurant by ID and populate the menus
    const restaurant = await Restaurant.findById(restaurantId).populate({
      path: "menus",
      options: { createdAt: -1 }, // Newest menu will come first
    });

    // If restaurant is not found
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Return the restaurant details
    return res.status(200).json({
      success: true,
      message: "Restaurant fetched successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Error fetching restaurant by ID:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the restaurant",
      error: error.message,
    });
  }
};

