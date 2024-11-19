const express = require("express");
const { verifyToken } = require("../middlewares/VerifyToken");
const { IsWorker } = require("../middlewares/IsWorker");
const router = express.Router();

router.get("/me", verifyToken, IsWorker, workerDetails);

module.exports = router;
