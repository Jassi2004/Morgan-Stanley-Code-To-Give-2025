import nodemailer from "nodemailer";

const sendEmail = async function(email, subject, message) {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 5000,
            socketTimeout: 5000
        });

        // Verify transporter configuration
        await transporter.verify();
        console.log("Email transporter verified successfully");

        // Send email
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM_EMAIL,
            to: email,
            subject: subject,
            html: message
        });

        console.log("Email sent successfully:", info.messageId);
        return info;

    } catch (err) {
        console.error("Email sending failed:", {
            error: err.message,
            email,
            subject
        });
        throw new Error("Failed to send email. Please try again later.");
    }
}



export default sendEmail;