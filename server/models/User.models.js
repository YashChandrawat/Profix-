const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    accountType: {
      type: String,
      required: true,
      enum: ["shopOwner", "worker", "client"],
    },
    profileData: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "profileModel", // Dynamically set the ref based on profileModel
    },
    profileModel: {
      type: String,
      required: true,
      enum: ["ShopOwnerData", "WorkerData", "ClientData"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
