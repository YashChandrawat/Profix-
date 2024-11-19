const User = require("../models/User.models");
const ShopOwner = require("../models/ShopOwner.models");
const Worker = require("../models/Worker.models");

exports.createShop = async (req, res) => {
  try {
    const { shopName, shopDescription, services, nieche } = req.body;
    const { id } = req.params; // User ID from route parameters

    // Validate required fields
    if (!shopName || !shopDescription || !services || !nieche) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (shopName, shopDescription, services, nieche) are required",
      });
    }

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Services must be a non-empty array",
      });
    }

    // Create new shop data
    const shopData = await ShopOwner.create({
      shopName,
      shopDescription,
      services,
      nieche,
    });

    // Find user and update their shopData field
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.shopData = shopData._id; // Associate shop with the user
    await user.save(); // Persist changes to the user document

    // Respond with success
    return res.status(201).json({
      success: true,
      message: "Shop created successfully and linked to the user",
      shopData,
      user,
    });
  } catch (error) {
    console.error("Error occurred while creating shop:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while creating shop",
      error: error.message,
    });
  }
};

exports.myShop = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    const user = await User.findById(userId).populate("shopData").exec();

    if (!user) {
      return res.status(402).json({
        success: false,
        message: "Error in fetching the user data",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shop Details fetched successfully",
      shopData: user.shopData,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Failed to fetch the shop details",
    });
  }
};

exports.updateShopDetails = async (req, res) => {
  try {
    const { shopName, shopDescription, services, nieche } = req.body;
    const { shopId } = req.params; // Shop ID from route parameters

    // Validate the shop ID
    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "Shop ID is required",
      });
    }

    // Find the shop by ID
    const shop = await ShopOwner.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Update shop details
    if (shopName) shop.shopName = shopName;
    if (shopDescription) shop.shopDescription = shopDescription;
    if (services) {
      if (!Array.isArray(services) || services.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Services must be a non-empty array",
        });
      }
      shop.services = services;
    }
    if (nieche) shop.nieche = nieche;

    // Save the updated shop details
    await shop.save();

    // Respond with the updated shop details
    return res.status(200).json({
      success: true,
      message: "Shop details updated successfully",
      shop,
    });
  } catch (error) {
    console.error("Error occurred while updating shop details:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating shop details",
      error: error.message,
    });
  }
};

exports.deleteShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    // Validate the presence of shopId
    if (!shopId) {
      return res.status(401).json({
        success: false,
        message: "Shop ID is not present",
      });
    }

    // Find the shop to delete
    const shop = await ShopOwner.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Delete the shop
    await ShopOwner.findByIdAndDelete(shopId);

    // Remove the shop reference from the associated user
    const user = await User.findOne({ shopData: shopId });
    if (user) {
      user.shopData = null; // Or null, based on your schema
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Shop and references deleted successfully",
    });
  } catch (error) {
    console.error("Error occurred while deleting shop:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete the shop",
      error: error.message,
    });
  }
};

exports.createWorker = async (req, res) => {
  try {
    const { name, address, contact, hoursAvailable, expertise, shopId } =
      req.body;

    const { userId } = req.user; // Extracting userId from the authenticated request

    // Validate input fields
    if (
      !name ||
      !address ||
      !contact ||
      !hoursAvailable ||
      !expertise ||
      !shopId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: name, address, contact, hoursAvailable, expertise, shopId",
      });
    }

    // Check if the shop exists
    const shop = await ShopOwner.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Create a new worker
    const newWorker = await Worker.create({
      name,
      address,
      contact,
      hoursAvailable,
      expertise,
      shop: shopId, // Reference to the shop
    });

    // Optionally, associate worker data with shop owner
    const shopOwner = await User.findById(userId);
    if (shopOwner) {
      shopOwner.workerData.push(newWorker._id); // Save the worker reference to the shop owner's profile
      await shopOwner.save();
    }

    shop.workers.push(newWorker._id);
    await shop.save();

    return res.status(201).json({
      success: true,
      message: "Worker created and associated with shop successfully",
      worker: newWorker,
    });
  } catch (error) {
    console.error("Error in createWorker:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create worker",
      error: error.message,
    });
  }
};

exports.deleteWorker = async (req, res) => {
  try {
    const { userId } = req.user; // Authenticated user ID
    const { workerId } = req.params; // Worker ID from request params

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: "Worker ID is required",
      });
    }

    // Find the worker and check if it exists
    const workerData = await Worker.findById(workerId);
    if (!workerData) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    // Validate if the shop exists and has the worker
    const shop = await ShopOwner.findById(workerData.shop);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Associated shop not found",
      });
    }

    // Validate if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove the worker reference from the shop's workers array
    await ShopOwner.findByIdAndUpdate(workerData.shop, {
      $pull: { workers: workerId },
    });

    // Remove the worker reference from the user's workerData array
    await User.findByIdAndUpdate(userId, {
      $pull: { workerData: workerId },
    });

    // Delete the worker
    await Worker.findByIdAndDelete(workerId);

    return res.status(200).json({
      success: true,
      message: "Worker deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting worker:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting worker data",
      error: error.message,
    });
  }
};
