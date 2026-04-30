import { MockAdapter } from "./mock.adapter.js";

class TraxAdapter extends MockAdapter {
    constructor(keys) {
        super("trax");
        this.apiKey      = keys?.apiKey      || "";
        this.apiPassword = keys?.apiPassword || "";
        this.BASE_URL    = "https://app.traxlogistics.com/api/v1";
    }

    async bookShipment(shipmentData) {
        return {
            trackingNo:  `TRX-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
            providerRef: `REF-${Date.now()}`,
            message:     "Booked with Trax (MOCK)",
        };
    }

    async getStatus(trackingNo) {
        const statuses = ["booked", "received", "in_transit", "out_for_delivery", "delivered"];
        return { trackingNo, status: statuses[Math.floor(Math.random() * statuses.length)], location: "Islamabad Hub", timestamp: new Date() };
    }

    async cancelShipment(trackingNo) {
        return { success: true, trackingNo, message: "Cancelled with Trax (MOCK)" };
    }
}

export default TraxAdapter;