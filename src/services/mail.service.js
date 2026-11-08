
import dotenv from "dotenv";
dotenv.config();

import { google } from "googleapis";
import nodemailer from "nodemailer";

console.log("\n📧 Initializing PrepAI Email Service...");

const requiredEnv = [
  "GOOGLE_USER",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
];

const missingEnv = requiredEnv.filter(
  (key) => !process.env[key]
);

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({
  version: "v1",
  auth: oauth2Client,
});

const mailComposer = nodemailer.createTransport({
  streamTransport: true,
  buffer: true,
  newline: "unix",
});

// Check Gmail API connection on server startup
export async function checkEmailService() {
  console.log("\n🔍 Checking Gmail OAuth2...");

  try {
    const { token } = await oauth2Client.getAccessToken();

    if (!token) {
      throw new Error("Access token not generated");
    }

    console.log("✅ Google OAuth2 authentication successful");
    console.log("📧 Sender:", process.env.GOOGLE_USER);
    console.log("🚀 Gmail API credentials loaded");

    return true;
  } catch (error) {
    console.error("❌ OAuth2 authentication failed:");
    console.error(error.response?.data || error.message);

    return false;
  }

}

// Send email
export async function sendEmail({ to, subject, html, text }) {
  console.log("\n📤 Sending email...");
  console.log("📩 Recipient:", to);
  console.log("📝 Subject:", subject);

  try {
    const info = await mailComposer.sendMail({
      from: `PrepAI <${process.env.GOOGLE_USER}>`,
      to,
      subject,
      html,
      text,
    });

    const rawMessage = Buffer
      .from(info.message)
      .toString("base64url");

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: rawMessage,
      },
    });

    console.log("✅ EMAIL SENT SUCCESSFULLY!");
    console.log("🆔 Gmail Message ID:", response.data.id);
    console.log("📩 Recipient:", to);

    return response.data;
  } catch (error) {
    console.error("\n❌ EMAIL SENDING FAILED!");
    console.error("📩 Recipient:", to);
    console.error("Reason:", error.response?.data || error.message);

    throw error;
  }
}

// Run initial check
if (missingEnv.length === 0) {
  checkEmailService();
} else {
  console.error("❌ Email service configuration incomplete:", missingEnv);
}
