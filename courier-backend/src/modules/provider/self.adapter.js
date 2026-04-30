import { BaseAdapter } from "./base.adapter.js";

class SelfAdapter extends BaseAdapter {
    async bookShipment(shipmentData) {
        return {
            trackingNo:  `SELF-${Date.now()}`,
            providerRef: null,
            message:     "Local delivery — status updated manually by admin",
        };
    }

    async getStatus(trackingNo) {
        return { trackingNo, status: null, message: "Local delivery — check portal for status" };
    }

    async cancelShipment(trackingNo) {
        return { success: true, trackingNo, message: "Local delivery cancelled" };
    }
}

export default SelfAdapter;