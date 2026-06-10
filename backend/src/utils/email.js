const nodemailer = require("nodemailer");

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST || "smtp.gmail.com",
    port:   parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// ─── Email Templates ────────────────────────────────────────────────────────

const emailTemplates = {
  bookingConfirmation: (booking, eventType, host) => ({
    subject: `Confirmed: ${eventType.title} with ${host.name}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: auto; background: #0B1220; color: #E5E7EB; padding: 40px; border-radius: 16px;">
        <div style="text-align:center; margin-bottom: 32px;">
          <h1 style="color: #8B5CF6; font-size: 28px; margin: 0;">Schedulely</h1>
        </div>
        <h2 style="color: #fff; font-size: 22px;">Your meeting is confirmed! 🎉</h2>
        <div style="background: #111827; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #1F2937;">
          <p style="margin: 8px 0; color: #9CA3AF;"><strong style="color:#E5E7EB;">Event:</strong> ${eventType.title}</p>
          <p style="margin: 8px 0; color: #9CA3AF;"><strong style="color:#E5E7EB;">Host:</strong> ${host.name}</p>
          <p style="margin: 8px 0; color: #9CA3AF;"><strong style="color:#E5E7EB;">Date & Time:</strong> ${new Date(booking.scheduledAt).toLocaleString()}</p>
          <p style="margin: 8px 0; color: #9CA3AF;"><strong style="color:#E5E7EB;">Duration:</strong> ${booking.duration} minutes</p>
          <p style="margin: 8px 0; color: #9CA3AF;"><strong style="color:#E5E7EB;">Booking Ref:</strong> #${booking.bookingRef}</p>
        </div>
        <p style="color: #6B7280; font-size: 14px; margin-top: 32px;">Need to cancel or reschedule? Use the links below.</p>
        <div style="margin-top: 16px; display: flex; gap: 12px;">
          <a href="${process.env.CLIENT_URL}/booking/${booking._id}/cancel?token=${booking.cancelToken}" 
             style="color: #EF4444; font-size: 14px;">Cancel Meeting</a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a href="${process.env.CLIENT_URL}/booking/${booking._id}/reschedule?token=${booking.rescheduleToken}" 
             style="color: #8B5CF6; font-size: 14px;">Reschedule</a>
        </div>
      </div>
    `,
  }),

  bookingNotificationToHost: (booking, eventType) => ({
    subject: `New booking: ${booking.invitee.name} — ${eventType.title}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: auto; background: #0B1220; color: #E5E7EB; padding: 40px; border-radius: 16px;">
        <h2 style="color: #fff;">New booking received! 🎉</h2>
        <div style="background: #111827; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #1F2937;">
          <p style="margin: 8px 0;"><strong style="color:#8B5CF6;">Invitee:</strong> ${booking.invitee.name} (${booking.invitee.email})</p>
          <p style="margin: 8px 0;"><strong style="color:#8B5CF6;">Event:</strong> ${eventType.title}</p>
          <p style="margin: 8px 0;"><strong style="color:#8B5CF6;">Date & Time:</strong> ${new Date(booking.scheduledAt).toLocaleString()}</p>
          <p style="margin: 8px 0;"><strong style="color:#8B5CF6;">Duration:</strong> ${booking.duration} minutes</p>
          ${booking.invitee.notes ? `<p style="margin: 8px 0;"><strong style="color:#8B5CF6;">Notes:</strong> ${booking.invitee.notes}</p>` : ""}
        </div>
      </div>
    `,
  }),

  bookingCancellation: (booking, eventType) => ({
    subject: `Cancelled: ${eventType.title}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: auto; background: #0B1220; color: #E5E7EB; padding: 40px; border-radius: 16px;">
        <h2 style="color: #EF4444;">Meeting Cancelled</h2>
        <p>Your booking <strong>#${booking.bookingRef}</strong> for <strong>${eventType.title}</strong> on <strong>${new Date(booking.scheduledAt).toLocaleString()}</strong> has been cancelled.</p>
        ${booking.cancellation?.reason ? `<p>Reason: ${booking.cancellation.reason}</p>` : ""}
      </div>
    `,
  }),
};

// ─── Send Email ──────────────────────────────────────────────────────────────

const sendEmail = async ({ to, subject, html }) => {
  // In dev, just log — don't crash if email not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`📧 [DEV] Email skipped (no config). To: ${to} | Subject: ${subject}`);
    return;
  }
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "Schedulely <noreply@schedulely.com>",
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error(`📧 Email failed: ${err.message}`);
    // Don't throw — email failure shouldn't break the API
  }
};

module.exports = { sendEmail, emailTemplates };
