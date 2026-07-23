import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the JSON body
    const { email, subject, htmlContent } = body;

    // Configure Nodemailer with Gmail SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // For SSL
      secure: true, // Use SSL
      auth: {
        user: "fasiledesshmels09@gmail.com",
        pass: "vvac mzrx ewzh puwx",
      },
    });

    const mailOptions = {
      from: "fasiledesshmels09@gmail.com",
      to: email,
      subject: subject,
      html: htmlContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Error sending email." },
      { status: 500 }
    );
  }
}
