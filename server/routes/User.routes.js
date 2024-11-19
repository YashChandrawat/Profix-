const express = require("express");
const { verifyToken } = require("../middlewares/VerifyToken");
const {
  currentUser,
  fetchUserById,
  deleteUserById,
} = require("../controllers/User.controller");

const router = express.Router();

router.get("/me", verifyToken, currentUser);
router.delete("/me", verifyToken, deleteUserById);
router.get("/:id", verifyToken, fetchUserById);

module.exports = router;
