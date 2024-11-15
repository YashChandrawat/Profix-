const mongoose = require("mongoose");

const shopOwnerSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
    },
    shopDescription: {
      type: String,
      required: true,
    },
    workers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkerData",
      },
    ],
    services: [
      {
        type: String,
        required: true,
      },
    ],
    niche: {
      type: String,
      required: true,
    },
    earnings: Number,
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShopOwnerData", shopOwnerSchema);
