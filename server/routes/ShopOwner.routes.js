const express = require("express");
const { verifyToken } = require("../middlewares/VerifyToken");
const { IsShopOwner } = require("../middlewares/IsShopOwner");
const router = express.Router();

router.post("/createShop/:id", verifyToken, IsShopOwner);

module.exports = router;
