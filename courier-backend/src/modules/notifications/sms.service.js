const twilio = require("twilio");

// Lazy client — only created when actually needed so missing env vars don't crash startup
const getClient = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error("Twilio credentials not configured (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN)");
  }
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

const sendSMS = async ({ to, message }) => {
  try {
    // Pakistani numbers need +92 prefix
    const formattedTo = to.startsWith("+") ? to : `+92${to.replace(/^0/, "")}`;

    const client = getClient();
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to:   formattedTo,
    });

    console.log(`[SMS] Sent to ${formattedTo}`);
  } catch (err) {
    console.error(`[SMS] Failed to send to ${to}:`, err.message);
  }
};

const shipmentStatusSMS = ({ trackingNo, status }) =>
  `Subak Raftar: Your shipment ${trackingNo} is now ${status.replace(/_/g, " ").toUpperCase()}.`;

module.exports = { sendSMS, shipmentStatusSMS };