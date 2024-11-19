const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String, required: true },
  accountType: {
    type: String,
    required: true,
    enum: ["Worker", "Client", "Owner"],
  },
  workerData: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkerData",
      default: null,
    },
  ],
  clientData: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientData",
      default: null,
    },
  ],
  shopData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShopData",
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
