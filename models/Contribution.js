const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Contribution",
  new mongoose.Schema({
    donor_email: String,
    recipient_name: String,
    recipient_area: String,
    hospital_address: String,
    accepted_at: Date,
    verified_at: Date
  })
);
