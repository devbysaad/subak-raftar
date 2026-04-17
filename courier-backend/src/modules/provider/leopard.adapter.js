const axios = require("axios");
const MockAdapter = require("./mock.adapter");

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

class LeopardsAdapter extends MockAdapter {
    constructor(keys) {
        super("leopards");
        this.apiKey      = keys?.apiKey      || "";
        this.apiPassword = keys?.apiPassword || "";
        this.BASE_URL    = "https://merchantapi.leopardscourier.com/api";
    }

    async bookShipment(shipmentData) {
        // ─── MOCK MODE (comment these 3 lines out and uncomment REAL MODE below to go live) ───
        await delay(300);
        return { trackingNo: `LCS-${Date.now()}-${Math.floor(Math.random()*9000+1000)}`, providerRef: `REF-${Date.now()}`, message: "Booked with Leopards (MOCK)" };
        // ─────────────────────────────────────────────────────────────────────────────────────

        // ─── REAL MODE (uncomment when Leopards API keys are ready) ──────────────────────────
        // const { data } = await axios.post(`${this.BASE_URL}/bookPacket/format/json`, {
        //     api_key:              this.apiKey,
        //     api_password:         this.apiPassword,
        //     consignee_name:       shipmentData.receiver.name,
        //     consignee_address:    shipmentData.receiver.address,
        //     consignee_city:       shipmentData.receiver.city,
        //     consignee_phone:      shipmentData.receiver.phone,
        //     order_weight:         shipmentData.weight || 0.5,
        //     cod_amount:           shipmentData.codAmount || 0,
        //     packet_pieces:        shipmentData.quantity || 1,
        // });
        // if (data.status !== 1) throw new Error(data.error);
        // return { trackingNo: data.track_number, providerRef: data.packet_id };
        // ─────────────────────────────────────────────────────────────────────────────────────
    }

    async getStatus(trackingNo) {
        // ─── MOCK MODE ───
        await delay(200);
        const statuses = ["booked","received","in_transit","out_for_delivery","delivered"];
        return { trackingNo, status: statuses[Math.floor(Math.random()*statuses.length)], location: "Lahore Hub", timestamp: new Date() };
        // ────────────────

        // ─── REAL MODE ───
        // const { data } = await axios.post(`${this.BASE_URL}/trackBookedPacket/format/json`, {
        //     api_key: this.apiKey, api_password: this.apiPassword, track_numbers: trackingNo,
        // });
        // const pkt = data.packet_list?.[0];
        // return { trackingNo, status: pkt?.PacketStatusCodeName, location: pkt?.city_name, timestamp: new Date(pkt?.Gmt_Time) };
        // ────────────────
    }

    async cancelShipment(trackingNo) {
        // ─── MOCK MODE ───
        await delay(200);
        return { success: true, trackingNo, message: "Cancelled with Leopards (MOCK)" };
        // ────────────────

        // ─── REAL MODE ───
        // Leopards does not have a direct cancel API — contact support to cancel booked packets.
        // throw new Error("Leopards cancel must be done via Leopards merchant portal.");
        // ────────────────
    }
}

module.exports = LeopardsAdapter;