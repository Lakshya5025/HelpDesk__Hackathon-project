import nodemailer from 'nodemailer';
import * as dotenv from "dotenv";
dotenv.config();




export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});



export async function mailer(email, username, password, role) {
    if (!email || !username || !password || !role) {
        throw new Error("Missing required parameters for sending login details.");
    }

    const html = `
        <p>Welcome!</p>
        <p>Your account has been created. Below are your login credentials — keep them confidential:</p>
        <ul>
            <li><strong>Username:</strong> ${username}</li>
            <li><strong>Password:</strong> ${password}</li>
            <li><strong>Role:</strong> ${role}</li>
        </ul>
        <p>Do NOT share these with anyone.</p>
    `;

    return transporter.sendMail({
        from: `"No-Reply" <${process.env.EMAIL}>`,
        to: email,
        subject: "Your Login Credentials",
        text:
            `Your account has been created.
            Username: ${username}
            Password: ${password}
            Role: ${role}

            Do NOT share these details with anyone.`,
        html,
    });
}

