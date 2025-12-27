const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Request",
  new mongoose.Schema({
    recipient_name: String,
    recipient_email: String,
    recipient_area: String,
    hospital_address: String,
    blood_group_required: String,
    health_issue: String,
    donor_email: String,
    donor_name: String,
    donation_type: String,
    status: String,
    requested_at: Date,
    accepted_at: Date,
    verified_at: Date,
    accepted_by: String,
    verified_by: String
  })
);
