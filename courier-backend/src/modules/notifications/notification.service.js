import { sendEmail, shipmentStatusEmail } from "./email.service.js";
import { sendSMS, shipmentStatusSMS } from "./sms.service.js";

const NOTIFY_ON = ["received", "in_transit", "out_for_delivery", "delivered", "failed", "cancelled"];

export const onStatusChange = async (shipment, newStatus, company) => {
    if (!NOTIFY_ON.includes(newStatus)) return;

    const trackingNo    = shipment.providerTrackingNo || String(shipment._id);
    const receiverName  = shipment.receiver?.name;
    const receiverPhone = shipment.receiver?.phone;

    if (company?.email) {
        const emailContent = shipmentStatusEmail({
            receiverName,
            trackingNo,
            status:   newStatus,
            provider: shipment.provider,
        });
        await sendEmail({ to: company.email, ...emailContent });
    }

    if (receiverPhone) {
        const message = shipmentStatusSMS({ trackingNo, status: newStatus });
        await sendSMS({ to: receiverPhone, message });
    }
};