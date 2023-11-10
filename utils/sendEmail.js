require("dotenv/config");
const nodemailer = require("nodemailer");

module.exports = (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      throw new Error(`Sending email failed: ${JSON.stringify(error)}`);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
