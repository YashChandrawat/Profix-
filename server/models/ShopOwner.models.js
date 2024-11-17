const mongoose = require("mongoose");

const shopDataSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  shopDescription: { type: String },
  shopNickName: { type: String },
  workers: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorkerData" }],
  services: { type: [String], required: true },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
});

module.exports = mongoose.model("ShopData", shopDataSchema);
