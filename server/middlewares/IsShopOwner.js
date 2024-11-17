const User = require("../models/User.models");

exports.IsShopOwner = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User id is not present" });
    }

    const user = await User.findById({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Error in getting the details of the user",
      });
    }

    if (user.accountType === "shopOwner") {
      next();
    } else {
      return res.status(402).json({
        success: false,
        message: "This is the private route for the ShopOwner",
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Error in validating the shop owner",
      error: error,
    });
  }
};
