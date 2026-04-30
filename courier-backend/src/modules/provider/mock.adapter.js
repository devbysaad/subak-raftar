import { BaseAdapter } from "./base.adapter.js";

const MOCK_STATUSES = ["booked", "received", "in_transit", "out_for_delivery", "delivered"];

export class MockAdapter extends BaseAdapter {
    constructor(providerName) {
        super();
        this.providerName = providerName;
        this.prefix = providerName.toUpperCase().slice(0, 3);
    }

    async bookShipment(_shipmentData) {
        return {
            trackingNo:  `${this.prefix}-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
            providerRef: `REF-${Date.now()}`,
            message:     `Booked with ${this.providerName} (MOCK)`,
        };
    }

    async getStatus(trackingNo) {
        const status = MOCK_STATUSES[Math.floor(Math.random() * MOCK_STATUSES.length)];
        return { trackingNo, status, location: "Karachi Hub", timestamp: new Date() };
    }

    async cancelShipment(trackingNo) {
        return { success: true, trackingNo, message: `Cancelled with ${this.providerName} (MOCK)` };
    }
}
