const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkerData",
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClientData",
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShopData",
    required: true,
  },
  time: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Completed", "Cancelled"],
  },
});
module.exports = mongoose.model("Appointment", appointmentSchema);
