const User = require("../models/User.models");

exports.workerDetails = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User Id not present",
      });
    }

    const user = await User.findById(userId).populate("workerData").exec();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User details not present",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Worker details fetched successfully",
        user: user,
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Error in getting Worker Details",
      error: error,
    });
  }
};
