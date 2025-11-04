require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();

// ✅ Middleware
app.use(cors({
  origin: [
    "https://makeoverbyreet.com",
    "https://www.makeoverbyreet.com",
    "https://makeover-website.onrender.com",
    "https://makeover-website2.onrender.com",
    "http://localhost:5000"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
}));
app.use(express.json());

// ✅ Handle preflight requests (important)
app.options('*', cors());

// ✅ Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is running with Resend' });
});

app.get('/contact', (req, res) => {
  res.json({ status: 'ok', message: 'Contact endpoint is reachable' });
});

// ✅ Contact form endpoint
app.post('/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, service, date, message } = req.body;

    // Validate input
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const sanitizedService = service || 'No service specified';
    const sanitizedDate = date?.trim() || 'No date specified';
    const sanitizedMessage = message?.trim() || 'No message provided';

    // ✅ Send email using Resend API
    await resend.emails.send({
      from: 'MakeOver <onboarding@resend.dev>',
      to: process.env.EMAIL_TO || 'your@email.com', // fallback
      reply_to: email.trim(),
      subject: `New Booking Request: ${sanitizedService} - ${fullName}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email.trim()}</p>
        <p><strong>Phone:</strong> ${phone.trim()}</p>
        <p><strong>Service:</strong> ${sanitizedService}</p>
        <p><strong>Preferred Date:</strong> ${sanitizedDate}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
      `.trim()
    });

    console.log('✅ Email sent via Resend');
    res.json({
      success: true,
      message: 'Thank you! Your booking request has been sent.'
    });

  } catch (err) {
    console.error('❌ Resend error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to send email. Please try again later.'
    });
  }
});

// ✅ Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
