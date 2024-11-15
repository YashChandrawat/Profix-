const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No token present",
      });
    }

    // Verify token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Token is invalid or expired",
    });
  }
};
