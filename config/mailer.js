const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASS
  }
});

async function sendEmail(to, subject, body) {
  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html: `<strong>${body.replace(/\n/g, "<br>")}</strong>`
    });
    return true;
  } catch (err) {
    console.error("Email error:", err);
    return false;
  }
}

module.exports = { sendEmail };
