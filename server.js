require('dotenv').config();
const express    = require('express');
const nodemailer = require('nodemailer');
const rateLimit  = require('express-rate-limit');
const path       = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((err, success) => {
  if (err) console.error('Mail error:', err.message);
  else     console.log('Mail server ready. Sending as:', process.env.GMAIL_USER);
});

app.post('/send', limiter, async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    await transporter.sendMail({
      from:    `"${name}" <${process.env.GMAIL_USER}>`,
      to:      process.env.GMAIL_USER,
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:8px;">
          <h2 style="margin:0 0 24px;font-size:20px;color:#111;">New contact form message</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#888;width:100px;">Name</td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#111;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#888;">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:14px;"><a href="mailto:${email}" style="color:#0066cc;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:10px 0;font-size:13px;color:#888;vertical-align:top;">Message</td>
              <td style="padding:10px 0;font-size:14px;color:#111;line-height:1.6;">${message.replace(/\n/g, '<br/>')}</td>
            </tr>
          </table>
          <p style="margin:24px 0 0;font-size:12px;color:#aaa;">Sent from your website contact form</p>
        </div>
      `,
    });

    await transporter.sendMail({
      from:    `"Kore" <${process.env.GMAIL_USER}>`,
      to:      email,
      replyTo: process.env.GMAIL_USER,
      subject: `Thanks for reaching out, ${name}!`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:8px;">
          <h2 style="margin:0 0 16px;font-size:20px;color:#111;">Thanks for your message!</h2>
          <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 16px;">Hi ${name},</p>
          <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 16px;">I've received your message and will get back to you within 24 hours.</p>
          <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 24px;">Talk soon,<br/><strong>Kore</strong></p>
          <div style="border-top:1px solid #e5e5e5;padding-top:16px;">
            <p style="font-size:12px;color:#aaa;margin:0;">Your message:</p>
            <p style="font-size:13px;color:#888;line-height:1.6;margin:8px 0 0;font-style:italic;">"${message}"</p>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: "Message sent — we'll be in touch shortly." });

  } catch (err) {
    console.error('MAIL FAILED:', err.message);
    res.status(500).json({ success: false, message: 'Failed: ' + err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));