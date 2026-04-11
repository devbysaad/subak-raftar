const BaseAdapter = require("./base.adapter");

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

    async bookShipment(shipmentData, companyId) {
        await delay();
        return {
            trackingNo: `${this.prefix}-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
            providerRef: `REF-${Date.now()}`,
            message: `Booked with ${this.providerName} (MOCK)`,
        };
    }

    async getStatus(trackingNo, companyId) {
        await delay();
        const status = MOCK_STATUSES[Math.floor(Math.random() * MOCK_STATUSES.length)];
        return {
            trackingNo,
            status,
            location: "Karachi Hub",
            timestamp: new Date(),
        };
    }

    async cancelShipment(trackingNo, companyId) {
        await delay();
        return {
            success: true,
            trackingNo,
            message: `Cancelled with ${this.providerName} (MOCK)`,
        };
    }
}

module.exports = MockAdapter;