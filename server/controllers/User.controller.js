const User = require("../models/User.models");

exports.currentUser = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract the user ID from the decoded token

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Error in getting User ID",
      });
    }

    // Use `findById` directly with the userId
    const currentUser = await User.findById(userId).select("-password").populate(""); // Exclude password field

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: currentUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching the current user",
      error: error.message,
    });
  }
};
