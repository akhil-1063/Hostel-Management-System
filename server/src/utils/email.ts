import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
    try {
        // 1. Create the "Delivery Truck"
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Using standard Gmail for development
            auth: {
                // You will put your real Gmail and App Password in your .env later!
                user: process.env.EMAIL_USER || 'dummy@gmail.com',
                pass: process.env.EMAIL_PASS || 'dummy_password'
            }
        });

        // 2. Load the truck with the message and drive it!
        await transporter.sendMail({
            from: `"Hostel Management System" <${process.env.EMAIL_USER || 'dummy@gmail.com'}>`,
            to,
            subject,
            text
        });

        console.log(`📧 Email successfully sent to ${to}!`);
    } catch (error) {
        console.log("❌ Error sending email:", error);
    }
};
