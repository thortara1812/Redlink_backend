const express = require("express");
const Donor = require("../models/Donor");
const { hashPassword } = require("../utils/hash");
const { AREAS } = require("../utils/constants");

const router = express.Router();

router.post("/register/donor", async (req, res) => {
  const { name, age, email, password, blood_group, area } = req.body;

  if (age < 18 || age > 65)
    return res.status(400).json({ message: "Age must be 18–65" });

  if (await Donor.findOne({ email }))
    return res.status(400).json({ message: "Email exists" });

  const coords = AREAS[area];
  await Donor.create({
    name,
    age,
    email,
    blood_group,
    area,
    passwordHash: hashPassword(password),
    location: { coordinates: [coords[1], coords[0]] }
  });

  res.json({ status: "success" });
});

router.post("/login/donor", async (req, res) => {
  const { email, password } = req.body;
  const donor = await Donor.findOne({ email });

  if (!donor || donor.passwordHash !== hashPassword(password))
    return res.status(401).json({ message: "Invalid login" });

  res.json({ status: "success", user: donor });
});

module.exports = router;
