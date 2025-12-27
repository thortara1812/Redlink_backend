const mongoose = require("mongoose");

module.exports = mongoose.model(
  "RecipientUser",
  new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String
  })
);
