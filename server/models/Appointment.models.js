const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopOwnerData",
      required: true,
    },
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
    date: { 
        type: Date, 
        required: true 
    },
    time: String,
    amount: Number,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
