// /* eslint-disable no-console */
// import nodemailer from "nodemailer";
// import { envVars } from "../Config/env";

// // Reusable transporter
// const transporter = nodemailer.createTransport({
//   host: "", // SMTP host
//   port: 465,                  // 465 for SSL, 587 for TLS
//   secure: true,               // true if using 465
//   auth: {
//     user: "",
//     pass: "",
//   tls: {
//     rejectUnauthorized: false, // useful for cPanel SSL
//   },
// });

// export const sendSessionConfirmationEmail = async (
//   to: string,
//   recipientName: string,
//   date: string,
//   time: string,
//   facilitatorName: string
// ) => {
//   try {
//     await transporter.sendMail({
//       from: `"Course" <${envVars.SMTP_EMAIL}>`,
//       to,
//       subject: "Your Course Session Has Been Confirmed",
//       html: `
//         <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #333;">
//         <h2 style="color: #2c3e50;">Hello ${recipientName},</h2>
//         </div>
//       `,
//     });
//   } catch (error) {
//     console.log("email error:", error);
//     throw new Error("Failed to send session confirmation email");
//   }
// };
