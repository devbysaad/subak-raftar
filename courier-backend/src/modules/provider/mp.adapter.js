const axios = require("axios");
const { MockAdapter } = require("./mock.adapter");

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

class MPAdapter extends MockAdapter {
    constructor(keys) {
        super("mp");
        this.apiKey      = keys?.apiKey      || "";
        this.apiPassword = keys?.apiPassword || "";
        this.BASE_URL    = "https://api.mpmessenger.com/api/v1";
    }

    async bookShipment(shipmentData) {
        // ─── MOCK MODE (comment these 3 lines out and uncomment REAL MODE below to go live) ───
        await delay(300);
        return { trackingNo: `MNP-${Date.now()}-${Math.floor(Math.random()*9000+1000)}`, providerRef: `REF-${Date.now()}`, message: "Booked with M&P (MOCK)" };
        // ─────────────────────────────────────────────────────────────────────────────────────

        // ─── REAL MODE (uncomment when M&P API keys are ready) ───────────────────────────────
        // const { data } = await axios.post(`${this.BASE_URL}/create-order`, {
        //     api_key:       this.apiKey,
        //     api_password:  this.apiPassword,
        //     recipient: {
        //         name:    shipmentData.receiver.name,
        //         address: shipmentData.receiver.address,
        //         city:    shipmentData.receiver.city,
        //         phone:   shipmentData.receiver.phone,
        //     },
        //     weights:     shipmentData.weight || 0.5,
        //     cod_amount:  shipmentData.codAmount || 0,
        //     is_cod:      shipmentData.isCOD ? 1 : 0,
        // });
        // if (!data.booking_id) throw new Error(data.message || "M&P booking failed");
        // return { trackingNo: data.cn_number, providerRef: data.booking_id };
        // ─────────────────────────────────────────────────────────────────────────────────────
    }

    async getStatus(trackingNo) {
        // ─── MOCK MODE ───
        await delay(200);
        const statuses = ["booked","received","in_transit","out_for_delivery","delivered"];
        return { trackingNo, status: statuses[Math.floor(Math.random()*statuses.length)], location: "Multan Hub", timestamp: new Date() };
        // ────────────────

        // ─── REAL MODE ───
        // const { data } = await axios.get(`${this.BASE_URL}/track-order/${trackingNo}`, {
        //     params: { api_key: this.apiKey, api_password: this.apiPassword },
        // });
        // return { trackingNo, status: data.status_code, location: data.current_city, timestamp: new Date(data.last_updated) };
        // ────────────────
    }

    async cancelShipment(trackingNo) {
        // ─── MOCK MODE ───
        await delay(200);
        return { success: true, trackingNo, message: "Cancelled with M&P (MOCK)" };
        // ────────────────

        // ─── REAL MODE ───
        // const { data } = await axios.post(`${this.BASE_URL}/cancel-order`, {
        //     api_key: this.apiKey, api_password: this.apiPassword, cn_number: trackingNo,
        // });
        // return { success: data.success, trackingNo };
        // ────────────────
    }
}

module.exports = MPAdapter;