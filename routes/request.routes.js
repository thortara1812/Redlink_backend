const express = require("express");
const Request = require("../models/Request");
const Donor = require("../models/Donor");
const Contribution = require("../models/Contribution");
const { sendEmail } = require("../config/mailer");
const { haversine } = require("../utils/geo");

const router = express.Router();

/* FIND DONORS */
router.post("/donors/find", async (req, res) => {
  const { blood_group, lat, lon, donation_type, limit } = req.body;
  const donors = await Donor.find({ blood_group });

  const eligible = donors.filter(d => {
    const now = new Date();
    if (donation_type === "Whole Blood" && d.last_whole_blood_donation) {
      return (now - d.last_whole_blood_donation) / 86400000 >= 56;
    }
    if (donation_type === "Platelets") {
      if (d.platelet_donations_this_year >= 7) return false;
      if (d.last_platelet_donation)
        return (now - d.last_platelet_donation) / 86400000 >= 7;
    }
    return true;
  });

  eligible.forEach(d => {
    d.distance_km = haversine(lat, lon, d.location.coordinates[1], d.location.coordinates[0]);
  });

  eligible.sort((a,b)=>a.distance_km-b.distance_km);

  res.json({ status: "success", donors: eligible.slice(0, limit || 10) });
});

/* SEND REQUEST */
router.post("/request/send", async (req, res) => {
  const doc = await Request.create({
    ...req.body,
    status: "pending",
    requested_at: new Date()
  });

  await sendEmail(
    req.body.donor_email,
    "Urgent Blood Donation Request",
    "Please open the app to accept."
  );

  res.json({ status: "success", request_id: doc._id });
});

/* ACCEPT */
router.post("/request/accept", async (req, res) => {
  const { request_id, donor_email } = req.body;

  const doc = await Request.findOneAndUpdate(
    { _id: request_id, donor_email, status: "pending" },
    { status: "accepted", accepted_at: new Date(), accepted_by: donor_email }
  );

  if (!doc) return res.status(404).json({ message: "Not found" });

  res.json({ status: "success" });
});

/* VERIFY */
router.post("/request/verify", async (req, res) => {
  const { request_id, recipient_email } = req.body;

  const doc = await Request.findOne({ _id: request_id, status: "accepted" });
  if (!doc) return res.status(404).json({ message: "Not found" });

  const now = new Date();
  await Donor.updateOne(
    { email: doc.accepted_by },
    { $inc: { donation_points: 100 } }
  );

  await Contribution.create({
    donor_email: doc.accepted_by,
    recipient_name: doc.recipient_name,
    recipient_area: doc.recipient_area,
    hospital_address: doc.hospital_address,
    accepted_at: doc.accepted_at,
    verified_at: now
  });

  doc.status = "completed";
  doc.verified_at = now;
  doc.verified_by = recipient_email;
  await doc.save();

  res.json({ status: "success" });
});

module.exports = router;
