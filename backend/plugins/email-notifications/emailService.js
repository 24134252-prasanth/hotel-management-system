const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();

// Configure API Key
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Initialize API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

module.exports = {
    sendEmail: async (recipient, subject, message) => {
        try {
            const emailData = {
                sender: { email: process.env.EMAIL_USER, name: "Hotel Booking System" },
                to: [{ email: recipient }],
                subject: subject,
                htmlContent: `<p>${message}</p>`
            };

            // Send email using Brevo
            const response = await apiInstance.sendTransacEmail(emailData);
            console.log(`✅ Email sent to ${recipient}`, response);
            return { success: true, message: "Email sent successfully" };
        } catch (error) {
            console.error("❌ Email sending error:", error.response?.body || error.message);
            return { success: false, message: "Email sending failed" };
        }
    }
};


// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// module.exports = {
//     sendEmail: async (recipient, subject, message) => {
//         try {
//             // Commenting mail sending part
//             // const mailOptions = {
//             //     from: process.env.EMAIL_USER,
//             //     to: recipient,
//             //     subject: subject,
//             //     text: message
//             // };
            
//             //await transporter.sendMail(mailOptions);
            
//             console.log(`Email sent to ${recipient}`);
//             return { success: true, message: "Email sent" };
//         } catch (error) {
//             console.error("Email error:", error);
//             return { success: false, message: "Email sending failed" };
//         }
//     }
// };
