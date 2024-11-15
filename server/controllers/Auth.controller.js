const User = require("../models/User.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword, contact, accountType } =
      req.body;

    // Validation
    if (
      !userName ||
      !email ||
      !password ||
      !confirmPassword ||
      !contact ||
      !accountType
    ) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Password didn't match",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set profile model based on account type
    let profileMod;
    if (accountType === "shopOwner") {
      profileMod = "ShopOwnerData";
    } else if (accountType === "worker") {
      profileMod = "WorkerData";
    } else if (accountType === "client") {
      profileMod = "ClientData";
    }

    // Create new user
    const newUser = await User.create({
      userName, // Use correct variable name here
      email,
      password: hashedPassword,
      contact,
      accountType,
      profileModel: profileMod,
    });

    if (newUser) {
      return res.status(200).json({
        success: true,
        message: "Signup Successful",
        user: newUser,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "User creation failed",
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Sign Up Failed",
      error: error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      // token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("auth_token", {
      httpOnly: true, // Ensure cookie is only accessible via HTTP
      secure: true, // Use secure cookies in production
      sameSite: "strict", // Prevent cross-site request forgery
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Logout failed",
    });
  }
};
