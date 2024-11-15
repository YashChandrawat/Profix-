const mongoose = require("mongoose");

const WorkerDataSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    expertise: {
      type: String,
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopOwnerData",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkerData", WorkerDataSchema);
