const express = require("express");
const RecipientUser = require("../models/RecipientUser");
const { hashPassword } = require("../utils/hash");

const router = express.Router();

router.post("/register/recipient", async (req, res) => {
  const { name, email, password } = req.body;

  if (await RecipientUser.findOne({ email }))
    return res.status(400).json({ message: "Email exists" });

  await RecipientUser.create({
    name,
    email,
    passwordHash: hashPassword(password)
  });

  res.json({ status: "success" });
});

router.post("/login/recipient", async (req, res) => {
  const { email, password } = req.body;
  const user = await RecipientUser.findOne({ email });

  if (!user || user.passwordHash !== hashPassword(password))
    return res.status(401).json({ message: "Invalid login" });

  res.json({ status: "success", user });
});

module.exports = router;
