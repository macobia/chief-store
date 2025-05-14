import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // TLS
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});