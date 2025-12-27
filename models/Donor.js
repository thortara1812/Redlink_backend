const mongoose = require("mongoose");

const DonorSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  email: { type: String, unique: true },
  passwordHash: String,
  blood_group: String,
  area: String,
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number]
  },
  donation_points: { type: Number, default: 0 },
  last_whole_blood_donation: Date,
  last_platelet_donation: Date,
  platelet_donations_this_year: { type: Number, default: 0 }
});

DonorSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Donor", DonorSchema);
