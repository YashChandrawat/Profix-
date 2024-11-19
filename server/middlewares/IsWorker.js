const User = require("../models/User.models");

exports.IsWorker = async (req, res, next) => {
  try {
    const { userId } = req.user;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User id is not present" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Error in getting the details of the user",
      });
    }

    if (user.accountType === "Worker") {
      next();
    } else {
      return res.status(402).json({
        success: false,
        message: "This is the private route for the Worker",
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Error in validating the Worker Profile",
      error: error,
    });
  }
};
