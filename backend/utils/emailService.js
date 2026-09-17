const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendResetEmail = async (email, resetLink) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Expense Tracker - Reset Your Password",
        html: `
            <h2>Password Reset Request</h2>

            <p>You requested to reset your Expense Tracker password.</p>

            <p>Click the button below to reset your password:</p>

            <a href="${resetLink}"
               style="
               display:inline-block;
               padding:10px 20px;
               background:#007bff;
               color:white;
               text-decoration:none;
               border-radius:5px;">
               Reset Password
            </a>

            <p>This link will expire after a limited time.</p>

            <p>If you did not request this, you can ignore this email.</p>
        `
    });
};

module.exports = sendResetEmail;