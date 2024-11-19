const User = require("../models/User.models");
const Worker = require("../models/Worker.models");
const Client = require("../models/Client.models");
const Shop = require("../models/ShopOwner.models");
const { default: mongoose } = require("mongoose");

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
    const currentUser = await User.findById(userId)
      .select("-password")
      .populate(""); // Exclude password field

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

exports.fetchUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is undefined",
      });
    }

    const data = await User.findById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let userData;
    if (data.accountType === "Owner") {
      userData = await User.findOne({ _id: id }).populate("shopData").exec();
    } else if (data.accountType === "Worker") {
      userData = await User.findOne({ _id: id }).populate("workerData").exec();
    } else if (data.accountType === "Client") {
      userData = await User.findOne({ _id: id }).populate("clientData").exec();
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid account type",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User found",
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching the user data",
      error: error.message,
    });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log("Id at delete user by id: ", userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Deleting the data associated with the User account type
    if (user.accountType === "Owner" && user.shopData) {
      await Shop.findByIdAndDelete(user.shopData); // Delete shop data
    } else if (user.accountType === "Worker" && user.workerData.length > 0) {
      for (const workerId of user.workerData) {
        await Worker.findByIdAndDelete(workerId); // Delete all associated workers
      }
    } else if (user.accountType === "Client" && user.clientData.length > 0) {
      for (const clientId of user.clientData) {
        await Client.findByIdAndDelete(clientId); // Delete all associated clients
      }
    }

    // Now delete the main user data
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User and related data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};
