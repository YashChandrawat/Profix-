const express = require("express");
const { verifyToken } = require("../middlewares/VerifyToken");
const { IsShopOwner } = require("../middlewares/IsShopOwner");
const {
  createShop,
  myShop,
  updateShopDetails,
  deleteShop,
  createWorker,
  deleteWorker,
} = require("../controllers/ShopOwner.controller");
const router = express.Router();

router.post("/createShop/:id", verifyToken, IsShopOwner, createShop);
router.get("/myShop", verifyToken, IsShopOwner, myShop);
router.put("/myShop/:shopId", verifyToken, IsShopOwner, updateShopDetails);
router.delete("/myShop/:shopId", verifyToken, IsShopOwner, deleteShop);
router.post("/createWorker", verifyToken, IsShopOwner, createWorker);
router.delete(
  "/deleteWorker/:workerId",
  verifyToken,
  IsShopOwner,
  deleteWorker
);

module.exports = router;
