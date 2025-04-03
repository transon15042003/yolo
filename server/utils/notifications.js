const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendNotification(subject, message) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.NOTIFICATION_EMAIL,
        subject: subject,
        text: message,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendNotification };
