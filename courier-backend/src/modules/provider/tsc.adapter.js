const axios = require("axios");
const MockAdapter = require("./mock.adapter");

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

class TCSAdapter extends MockAdapter {
    constructor(keys) {
        super("tcs");
        this.apiKey      = keys?.apiKey      || "";
        this.apiPassword = keys?.apiPassword || "";
        this.BASE_URL    = "https://sandbox.tcscourier.com/v1"; // switch to prod URL when live
    }

    async bookShipment(shipmentData) {
        // ─── MOCK MODE (comment these 3 lines out and uncomment REAL MODE below to go live) ───
        await delay(300);
        return { trackingNo: `TCS-${Date.now()}-${Math.floor(Math.random()*9000+1000)}`, providerRef: `REF-${Date.now()}`, message: "Booked with TCS (MOCK)" };
        // ─────────────────────────────────────────────────────────────────────────────────────

        // ─── REAL MODE (uncomment when TCS API keys are ready) ────────────────────────────────
        // const { data } = await axios.post(`${this.BASE_URL}/bookPacket`, {
        //     Apikey:        this.apiKey,
        //     ApiPassword:   this.apiPassword,
        //     ConsigneeName: shipmentData.receiver.name,
        //     ConsigneeAddress: shipmentData.receiver.address,
        //     ConsigneeCity: shipmentData.receiver.city,
        //     ConsigneeMobile: shipmentData.receiver.phone,
        //     Weight:        shipmentData.weight || 1,
        //     CodAmount:     shipmentData.codAmount || 0,
        //     ProductType:   "overnight",
        // });
        // return { trackingNo: data.TCSWaybill, providerRef: data.PacketID };
        // ─────────────────────────────────────────────────────────────────────────────────────
    }

    async getStatus(trackingNo) {
        // ─── MOCK MODE ───
        await delay(200);
        const statuses = ["booked","received","in_transit","out_for_delivery","delivered"];
        return { trackingNo, status: statuses[Math.floor(Math.random()*statuses.length)], location: "Karachi Hub", timestamp: new Date() };
        // ────────────────

        // ─── REAL MODE ───
        // const { data } = await axios.get(`${this.BASE_URL}/trackPacket/${trackingNo}`, {
        //     headers: { Apikey: this.apiKey, ApiPassword: this.apiPassword },
        // });
        // return { trackingNo, status: data.Status, location: data.Location, timestamp: new Date(data.Timestamp) };
        // ────────────────
    }

    async cancelShipment(trackingNo) {
        // ─── MOCK MODE ───
        await delay(200);
        return { success: true, trackingNo, message: "Cancelled with TCS (MOCK)" };
        // ────────────────

        // ─── REAL MODE ───
        // const { data } = await axios.post(`${this.BASE_URL}/cancelPacket`, {
        //     Apikey: this.apiKey, ApiPassword: this.apiPassword, TCSWaybill: trackingNo,
        // });
        // return { success: data.Success, trackingNo };
        // ────────────────
    }
}

module.exports = TCSAdapter;