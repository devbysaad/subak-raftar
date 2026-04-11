const BaseAdapter = require("./base.adapter");

// Self = courier company delivers themselves (local Karachi)
// No API calls — admin updates status manually from dashboard

class SelfAdapter extends BaseAdapter {
    async bookShipment(shipmentData, companyId) {
        return {
            trackingNo: `SELF-${Date.now()}`,
            providerRef: null,
            message: "Local delivery — status updated manually by admin",
        };
    }

    async getStatus(trackingNo, companyId) {
        return {
            trackingNo,
            status: null,
            message: "Local delivery — check portal for status",
        };
    }

    async cancelShipment(trackingNo, companyId) {
        return {
            success: true,
            trackingNo,
            message: "Local delivery cancelled",
        };
    }
}

module.exports = SelfAdapter;