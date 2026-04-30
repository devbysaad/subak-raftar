const { MockAdapter } = require("./mock.adapter");

class LeopardsAdapter extends MockAdapter {
    constructor(keys) {
        super("leopards");
        this.apiKey      = keys?.apiKey      || "";
        this.apiPassword = keys?.apiPassword || "";
        this.BASE_URL    = "https://merchantapi.leopardscourier.com/api";
    }

    async bookShipment(shipmentData) {
        return {
            trackingNo:  `LCS-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
            providerRef: `REF-${Date.now()}`,
            message:     "Booked with Leopards (MOCK)",
        };
    }

    async getStatus(trackingNo) {
        const statuses = ["booked", "received", "in_transit", "out_for_delivery", "delivered"];
        return {
            trackingNo,
            status:    statuses[Math.floor(Math.random() * statuses.length)],
            location:  "Lahore Hub",
            timestamp: new Date(),
        };
    }

    async cancelShipment(trackingNo) {
        return { success: true, trackingNo, message: "Cancelled with Leopards (MOCK)" };
    }
}

module.exports = LeopardsAdapter;
