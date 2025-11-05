require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

// ✅ CORS Setup
const allowedOrigins = [
  "https://makeoverbyreet.com",
  "https://www.makeoverbyreet.com",
  "https://makeover-website.onrender.com",
  "https://makeover-website2.onrender.com",
  "http://localhost:5000",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy violation"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// ✅ Handle preflight requests (Express 5 requires new wildcard syntax)
app.options("(.*)", cors(corsOptions));

// ✅ Middleware
app.use(express.json());

// ✅ Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Health check route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "MakeOver API is live ✨" });
});

// ✅ Contact route check
app.get("/contact", (req, res) => {
  res.json({ status: "ok", message: "Contact endpoint is active 🚀" });
});

// ✅ Contact form submission
app.post("/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, service, date, message } = req.body;

    // 🔒 Basic validation
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: "Please fill all required fields (Name, Email, Phone).",
      });
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const bookingService = service?.trim() || "No service specified";
    const bookingDate = date?.trim() || "No date specified";
    const userMessage = (message?.trim() || "No message provided").replace(/\n/g, "<br>");

    // 📧 Send email via Resend
    const emailResponse = await resend.emails.send({
      from: process.env.EMAIL_FROM || "MakeOver <onboarding@resend.dev>", // tip: use your verified domain
      to: process.env.EMAIL_TO || "your@email.com",
      reply_to: email.trim(),
      subject: `New Booking Request from ${fullName}`,
      html: `
        <h2>New Booking Request 💄</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email.trim()}</p>
        <p><strong>Phone:</strong> ${phone.trim()}</p>
        <p><strong>Service:</strong> ${bookingService}</p>
        <p><strong>Preferred Date:</strong> ${bookingDate}</p>
        <p><strong>Message:</strong></p>
        <p>${userMessage}</p>
      `.trim(),
    });

    console.log("✅ Email sent successfully:", emailResponse.id || "No ID");

    res.json({
      success: true,
      message: "Thank you! Your booking request has been sent successfully 💅",
    });
  } catch (err) {
    console.error("❌ Error sending email via Resend:", err);
    res.status(500).json({
      success: false,
      error: "Server error while sending email. Please try again later.",
    });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
