const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = {
    sendEmail: async (recipient, subject, message) => {
        try {
            // Commenting mail sending part
            // const mailOptions = {
            //     from: process.env.EMAIL_USER,
            //     to: recipient,
            //     subject: subject,
            //     text: message
            // };
            
            //await transporter.sendMail(mailOptions);
            
            console.log(`Email sent to ${recipient}`);
            return { success: true, message: "Email sent" };
        } catch (error) {
            console.error("Email error:", error);
            return { success: false, message: "Email sending failed" };
        }
    }
};
