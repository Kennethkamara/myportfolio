import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Here you can integrate with email services like:
    // - Resend: https://resend.com
    // - SendGrid: https://sendgrid.com
    // - Nodemailer with SMTP
    // - Web3Forms: https://web3forms.com

    // For now, we'll use Web3Forms (free service)
    // To use this, you need to get an access key from https://web3forms.com
    const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;

    if (!WEB3FORMS_ACCESS_KEY) {
      console.log("[v0] Contact form submission:", { name, email, message });
      return NextResponse.json(
        {
          success: false,
          error:
            "Contact form not configured. Set WEB3FORMS_ACCESS_KEY to send real emails.",
        },
        { status: 500 },
      );
    }

    // Send email via Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Origin: "http://127.0.0.1:3000",
        Referer: "http://127.0.0.1:3000/",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        sender_name: name,
        reply_to: email,
        name,
        email,
        message,
        subject: `New Contact Form Submission from ${name}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Web3Forms error: ${response.status}`);
    }

    if (data.success) {
      return NextResponse.json({
        success: true,
        message: "Message sent successfully!",
      });
    }

    throw new Error(data.message || "Failed to send message");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[v0] Contact form error:", message, error);
    return NextResponse.json(
      { error: message || "Failed to send message. Please try again." },
      { status: 500 },
    );
  }
}
