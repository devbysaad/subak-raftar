import twilio from "twilio";

const getClient = () => {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        throw new Error("Twilio credentials not configured");
    }
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

export const sendSMS = async ({ to, message }) => {
    try {
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

export const shipmentStatusSMS = ({ trackingNo, status }) =>
    `Subak Raftar: Your shipment ${trackingNo} is now ${status.replace(/_/g, " ").toUpperCase()}.`;