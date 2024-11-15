const mongoose = require("mongoose");

const ClientDataSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: String,
    contact: String,
    email: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClientData", ClientDataSchema);
