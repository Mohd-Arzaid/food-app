import { Profile } from "../../models/user/profile.model.js";
import { User } from "../../models/user/user.model.js";
import uploadImageToCloudinary from "../../utils/imageUploader.js";

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { password, ...userWithoutPassword } = userDetails.toObject(); // Omit password from the response

    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching user details.",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      address,
      city,
      country,
    } = req.body;

    const userId = req.user.id;

     // Check if the file is uploaded
     if (!req.files || !req.files.displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Find the user by ID and populate their profile
    const userDetails = await User.findById(userId).populate(
      "additionalDetails"
    );

    // Check if the user exists
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user details
    userDetails.firstName = firstName || userDetails.firstName;
    userDetails.lastName = lastName || userDetails.lastName;

     // Handle profile picture upload if present
     if (req.files && req.files.displayPicture) {
      const displayPicture = req.files.displayPicture;
      // Upload image to Cloudinary
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000, // height
        80 // quality as a percentage
      );
      userDetails.image = image.secure_url;
    }

    // Save updated user details
    await userDetails.save();

    const profile = userDetails.additionalDetails;
    
    profile.address = address || profile.address;
    profile.city = city || profile.city;
    profile.country = country || profile.country;
    await profile.save();

    const { password, ...userWithoutPassword } = userDetails.toObject(); // Omit password from the response

    // Return the updated user details
    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "An error occurred while updating the profile.",
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //Delete Profile of the User
    await Profile.findByIdAndDelete(user.additionalDetails);

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "User cannot be deleted successfully",
    });
  }
};


