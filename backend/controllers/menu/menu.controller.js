import { Menu } from "../../models/menu/menu.model.js";
import { Restaurant } from "../../models/restaurant/restaurant.model.js";
import { User } from "../../models/user/user.model.js";
import uploadImageToCloudinary from "../../utils/imageUploader.js";

// Create Menu
export const addMenu = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, description, price } = req.body;
    // validate
    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    // Check if the file is uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "Menu image is required",
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

    const menu = await Menu.create({
        name,
        description,
        price,
        imageUrl: uploadedImage.secure_url,
    });
    const restaurant = await Restaurant.findOne({user:userId});
    if(restaurant) {
        restaurant.menus.push(menu._id);
        await restaurant.save();
    }

    return res.status(201).json({
      success: true,
      message: "Menu added successfully",
      menu,
    });
  } catch (error) {
    console.error("Menu creation error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding Menu",
      error: error.message,
    });
  }
};

// Edit Menu
export const editMenu = async (req, res) => {
  try {
    const {id} = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const { name, description, price } = req.body;
    // validate
    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found!",
      });
    }

    // Update menu details
    if(name) menu.name = name;
    if(description) menu.description = description;
    if(price) menu.price = price;

    // Handle image upload (optional)
    if( req.files && req.files.image) {
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
      menu.imageUrl = uploadedImage.secure_url;
    }
    await menu.save();
    return res.status(200).json({
      success: true,
      message: "Menu updated successfully",
      menu,
    });

  } catch (error) {
    console.error("Menu edit error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while editing Menu",
      error: error.message,
    });
    
  }
}
