import { MockAdapter } from "./mock.adapter.js";

class TCSAdapter extends MockAdapter {
    constructor(keys) {
        super("tcs");
        this.apiKey      = keys?.apiKey      || "";
        this.apiPassword = keys?.apiPassword || "";
        this.BASE_URL    = "https://sandbox.tcscourier.com/v1";
    }

    async bookShipment(shipmentData) {
        return {
            trackingNo:  `TCS-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
            providerRef: `REF-${Date.now()}`,
            message:     "Booked with TCS (MOCK)",
        };
    }

    async getStatus(trackingNo) {
        const statuses = ["booked", "received", "in_transit", "out_for_delivery", "delivered"];
        return { trackingNo, status: statuses[Math.floor(Math.random() * statuses.length)], location: "Karachi Hub", timestamp: new Date() };
    }

    async cancelShipment(trackingNo) {
        return { success: true, trackingNo, message: "Cancelled with TCS (MOCK)" };
    }
}

export default TCSAdapter;
