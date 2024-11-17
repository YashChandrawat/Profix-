const mongoose = require("mongoose");

const workerDataSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShopData",
    required: true,
  },
  hoursAvailable: { type: String, required: true },
  expertise: { type: String, required: true },
});

module.exports = mongoose.model("WorkerData", workerDataSchema);
