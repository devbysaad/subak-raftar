const axios = require("axios");
const MockAdapter = require("./mock.adapter");

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

class TraxAdapter extends MockAdapter {
    constructor(keys) {
        super("trax");
        this.apiKey      = keys?.apiKey      || "";
        this.apiPassword = keys?.apiPassword || "";
        this.BASE_URL    = "https://app.traxlogistics.com/api/v1";
    }

    async bookShipment(shipmentData) {
        // ─── MOCK MODE (comment these 3 lines out and uncomment REAL MODE below to go live) ───
        await delay(300);
        return { trackingNo: `TRX-${Date.now()}-${Math.floor(Math.random()*9000+1000)}`, providerRef: `REF-${Date.now()}`, message: "Booked with Trax (MOCK)" };
        // ─────────────────────────────────────────────────────────────────────────────────────

        // ─── REAL MODE (uncomment when Trax API keys are ready) ──────────────────────────────
        // const { data } = await axios.post(`${this.BASE_URL}/orders`, {
        //     authentication: { username: this.apiKey, password: this.apiPassword },
        //     consignee: {
        //         first_name: shipmentData.receiver.name,
        //         address:    shipmentData.receiver.address,
        //         city:       shipmentData.receiver.city,
        //         phone:      shipmentData.receiver.phone,
        //     },
        //     item: { product_name: shipmentData.itemType || "Parcel", weight: shipmentData.weight || 0.5 },
        //     invoices: [{ amount: shipmentData.codAmount || 0, type: shipmentData.isCOD ? "COD" : "Prepaid" }],
        // });
        // return { trackingNo: data.tracking_code, providerRef: data.order_id };
        // ─────────────────────────────────────────────────────────────────────────────────────
    }

    async getStatus(trackingNo) {
        // ─── MOCK MODE ───
        await delay(200);
        const statuses = ["booked","received","in_transit","out_for_delivery","delivered"];
        return { trackingNo, status: statuses[Math.floor(Math.random()*statuses.length)], location: "Islamabad Hub", timestamp: new Date() };
        // ────────────────

        // ─── REAL MODE ───
        // const { data } = await axios.get(`${this.BASE_URL}/orders/${trackingNo}`, {
        //     auth: { username: this.apiKey, password: this.apiPassword },
        // });
        // return { trackingNo, status: data.status_slug, location: data.current_location, timestamp: new Date(data.updated_at) };
        // ────────────────
    }

    async cancelShipment(trackingNo) {
        // ─── MOCK MODE ───
        await delay(200);
        return { success: true, trackingNo, message: "Cancelled with Trax (MOCK)" };
        // ────────────────

        // ─── REAL MODE ───
        // const { data } = await axios.delete(`${this.BASE_URL}/orders/${trackingNo}`, {
        //     auth: { username: this.apiKey, password: this.apiPassword },
        // });
        // return { success: data.success, trackingNo };
        // ────────────────
    }
}

module.exports = TraxAdapter;