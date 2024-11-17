const mongoose = require("mongoose");

const clientDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String },
  email: { type: String },
  appointmentHistory: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  ],
});

module.exports = mongoose.model("ClientData", clientDataSchema);
