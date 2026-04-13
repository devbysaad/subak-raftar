const { sendEmail, shipmentStatusEmail } = require("./email.service");
const { sendSMS, shipmentStatusSMS } = require("./sms.service");

// statuses that warrant a customer notification
const NOTIFY_ON = [
    "received",
    "in_transit",
    "out_for_delivery",
    "delivered",
    "failed",
    "cancelled",
];

const onStatusChange = async (shipment, newStatus, company) => {
    if (!NOTIFY_ON.includes(newStatus)) return;

    const trackingNo = shipment.providerTrackingNo || String(shipment._id);
    const receiverName = shipment.receiver?.name;
    const receiverPhone = shipment.receiver?.phone;

    // email notification
    if (company?.email) {
        const emailContent = shipmentStatusEmail({
            receiverName,
            trackingNo,
            status: newStatus,
            provider: shipment.provider,
        });
        await sendEmail({ to: company.email, ...emailContent });
    }

    // SMS notification to receiver
    if (receiverPhone) {
        const message = shipmentStatusSMS({ trackingNo, status: newStatus });
        await sendSMS({ to: receiverPhone, message });
    }
};

module.exports = { onStatusChange };