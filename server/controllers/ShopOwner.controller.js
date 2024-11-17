const User = require("../models/User.models");
const ShopOwner = require("../models/ShopOwner.models");

exports.createShop = async (req, res) => {
  try {
    const { shopName, shopDescription, services, niche } = req.body;
    const { id } = req.params.id;

    if (!shopName || !shopDescription || !services || !niche) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    const shopData = await ShopOwner.create({
      shopName: shopName,
      shopDescription: shopDescription,
      services: services,
      niche: niche,
    });

    const user = await User.findById({ id });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Error occurred in creating shop",
    });
  }
};
