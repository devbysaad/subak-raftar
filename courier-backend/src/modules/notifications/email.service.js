import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: `"Subak Raftar" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

    } catch (err) {

    }
};

export const shipmentStatusEmail = ({ receiverName, trackingNo, status, provider }) => ({
    subject: `Your shipment ${trackingNo} — ${status.replace(/_/g, " ").toUpperCase()}`,
    html: `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #1a1a1a">Shipment Update</h2>
      <p>Hi <strong>${receiverName}</strong>,</p>
      <p>Your shipment status has been updated:</p>
      <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0">
        <p style="margin:0"><strong>Tracking No:</strong> ${trackingNo}</p>
        <p style="margin:8px 0 0"><strong>Status:</strong> ${status.replace(/_/g, " ").toUpperCase()}</p>
        <p style="margin:8px 0 0"><strong>Provider:</strong> ${provider.toUpperCase()}</p>
      </div>
      <p style="color: #666; font-size: 13px">— Subak Raftar</p>
    </div>
  `,
});