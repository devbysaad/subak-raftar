const { BaseAdapter } = require("./base.adapter");

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

const MOCK_STATUSES = [
    "booked",
    "received",
    "in_transit",
    "out_for_delivery",
    "delivered",
];

class MockAdapter extends BaseAdapter {
    constructor(providerName) {
        super();
        this.providerName = providerName;
        this.prefix = providerName.toUpperCase().slice(0, 3);
    }

    async bookShipment(_shipmentData) {
        await delay(Math.floor(Math.random() * 100) + 200);
        return {
            trackingNo: `${this.prefix}-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
            providerRef: `REF-${Date.now()}`,
            message: `Booked with ${this.providerName} (MOCK)`,
        };
    }

    async getStatus(trackingNo) {
        await delay(Math.floor(Math.random() * 100) + 200);
        const status = MOCK_STATUSES[Math.floor(Math.random() * MOCK_STATUSES.length)];
        return {
            trackingNo,
            status,
            location: "Karachi Hub",
            timestamp: new Date(),
        };
    }

    async cancelShipment(trackingNo) {
        await delay(Math.floor(Math.random() * 100) + 200);
        return {
            success: true,
            trackingNo,
            message: `Cancelled with ${this.providerName} (MOCK)`,
        };
    }
}

module.exports = { MockAdapter };
