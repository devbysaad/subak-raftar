import { MockAdapter } from "./mock.adapter.js";

class MPAdapter extends MockAdapter {
    constructor(keys) {
        super("mp");
        this.apiKey      = keys?.apiKey      || "";
        this.apiPassword = keys?.apiPassword || "";
        this.BASE_URL    = "https://api.mpmessenger.com/api/v1";
    }

    async bookShipment(shipmentData) {
        return {
            trackingNo:  `MNP-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
            providerRef: `REF-${Date.now()}`,
            message:     "Booked with M&P (MOCK)",
        };
    }

    async getStatus(trackingNo) {
        const statuses = ["booked", "received", "in_transit", "out_for_delivery", "delivered"];
        return { trackingNo, status: statuses[Math.floor(Math.random() * statuses.length)], location: "Multan Hub", timestamp: new Date() };
    }

    async cancelShipment(trackingNo) {
        return { success: true, trackingNo, message: "Cancelled with M&P (MOCK)" };
    }
}

export default MPAdapter;