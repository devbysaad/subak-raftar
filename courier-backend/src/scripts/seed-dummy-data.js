require("dotenv").config();
const mongoose = require("mongoose");
const Shipment = require("../modules/shipments/shipment.model");
const StatusHistory = require("../modules/status-history/statusHistory.model");
const Complaint = require("../modules/complaints/complaint.model");
const LoadSheet = require("../modules/loadsheets/loadsheet.model");
const User = require("../modules/users/user.model");
const { PROVIDERS, SHIPMENT_STATUS } = require("../config/constants");

const MONGO_URI = process.env.MONGO_URI;

const generateTrackingNo = (provider) => {
    const prefix = {
        [PROVIDERS.TCS]: "TCS",
        [PROVIDERS.LEOPARDS]: "LEO",
        [PROVIDERS.TRAX]: "TRX",
        [PROVIDERS.MP]: "MP"
    }[provider];
    return `${prefix}${Math.floor(10000000 + Math.random() * 90000000)}`;
};

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateData = async () => {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    
    console.log("🗑️ Clearing existing data...");
    await Shipment.deleteMany({});
    await StatusHistory.deleteMany({});
    await Complaint.deleteMany({});
    await LoadSheet.deleteMany({});
    // Optional: we leave users alone to keep the admin account, but let's make sure admin is there.
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
        console.error("❌ Admin user not found. Please run seed.js first.");
        process.exit(1);
    }

    const providersList = Object.values(PROVIDERS).filter(p => p !== PROVIDERS.MOCK);
    const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Multan", "Faisalabad", "Peshawar", "Quetta"];
    const itemTypes = ["Electronics", "Clothing", "Documents", "Accessories", "Home Appliances"];

    const shipments = [];
    
    console.log("📦 Generating 200 dummy shipments...");
    for (let i = 0; i < 200; i++) {
        const isCOD = Math.random() > 0.3;
        const statusList = Object.values(SHIPMENT_STATUS);
        
        // Weighting statuses for realism
        const weightedStatuses = [
            ...Array(40).fill(SHIPMENT_STATUS.BOOKED),
            ...Array(20).fill(SHIPMENT_STATUS.RECEIVED),
            ...Array(30).fill(SHIPMENT_STATUS.IN_TRANSIT),
            ...Array(15).fill(SHIPMENT_STATUS.OUT_FOR_DELIVERY),
            ...Array(70).fill(SHIPMENT_STATUS.DELIVERED),
            ...Array(15).fill(SHIPMENT_STATUS.FAILED),
            ...Array(10).fill(SHIPMENT_STATUS.CANCELLED)
        ];
        
        const status = getRandomItem(weightedStatuses);
        const provider = getRandomItem(providersList);

        const createdAtDate = new Date();
        createdAtDate.setDate(createdAtDate.getDate() - Math.floor(Math.random() * 30)); // past 30 days

        shipments.push({
            createdBy: admin._id,
            receiver: {
                name: `Customer ${i+1}`,
                phone: `03${Math.floor(10000000 + Math.random() * 90000000)}`,
                address: `House ${Math.floor(Math.random() * 100)}, Street ${Math.floor(Math.random() * 20)}`,
                city: getRandomItem(cities)
            },
            weight: Number((Math.random() * 5).toFixed(1)) || 0.5,
            itemType: getRandomItem(itemTypes),
            quantity: Math.floor(Math.random() * 3) + 1,
            specialInstruction: Math.random() > 0.8 ? "Handle with care" : "",
            provider,
            providerTrackingNo: generateTrackingNo(provider),
            status,
            isCOD,
            codAmount: isCOD ? Math.floor(Math.random() * 10000) + 500 : 0,
            createdAt: createdAtDate,
            updatedAt: new Date(createdAtDate.getTime() + Math.random() * 86400000)
        });
    }

    const insertedShipments = await Shipment.insertMany(shipments);

    console.log("⏱️ Generating status histories...");
    const histories = [];
    for (const shipment of insertedShipments) {
        // Everyone gets booked
        histories.push({
            shipmentId: shipment._id,
            status: SHIPMENT_STATUS.BOOKED,
            timestamp: shipment.createdAt,
            location: "Subak Raftar Hub",
            remarks: "Shipment booked in system"
        });

        // Add history up to current status
        const sequence = [
            SHIPMENT_STATUS.RECEIVED,
            SHIPMENT_STATUS.IN_TRANSIT,
            SHIPMENT_STATUS.OUT_FOR_DELIVERY,
            SHIPMENT_STATUS.DELIVERED
        ];

        let timeOffset = 3600000; // 1 hour
        for (const s of sequence) {
            if (shipment.status === SHIPMENT_STATUS.BOOKED) break;
            
            histories.push({
                shipmentId: shipment._id,
                status: s,
                timestamp: new Date(shipment.createdAt.getTime() + timeOffset),
                location: `Hub ${Math.floor(Math.random() * 5)}`,
                remarks: `Status updated to ${s}`
            });
            timeOffset += Math.random() * 86400000; // + ~1 day

            if (s === shipment.status) break;
            // Handle failed/cancelled
            if (shipment.status === SHIPMENT_STATUS.FAILED && s === SHIPMENT_STATUS.OUT_FOR_DELIVERY) {
                histories.push({
                    shipmentId: shipment._id,
                    status: SHIPMENT_STATUS.FAILED,
                    timestamp: new Date(shipment.createdAt.getTime() + timeOffset),
                    location: "Customer Address",
                    remarks: "Customer unavailable"
                });
                break;
            }
            if (shipment.status === SHIPMENT_STATUS.CANCELLED && s === SHIPMENT_STATUS.RECEIVED) {
                histories.push({
                    shipmentId: shipment._id,
                    status: SHIPMENT_STATUS.CANCELLED,
                    timestamp: new Date(shipment.createdAt.getTime() + timeOffset),
                    location: "Hub 1",
                    remarks: "Cancelled by admin"
                });
                break;
            }
        }
    }
    await StatusHistory.insertMany(histories);

    console.log("📄 Generating LoadSheets...");
    const bookedParcels = insertedShipments.filter(s => s.status === SHIPMENT_STATUS.BOOKED).slice(0, 20);
    if (bookedParcels.length > 0) {
        await LoadSheet.create({
            loadSheetNo: `LS-${Date.now()}`,
            parcelIds: bookedParcels.map(p => p._id),
            createdBy: admin._id
        });
    }

    console.log("😠 Generating Complaints...");
    const failedParcels = insertedShipments.filter(s => s.status === SHIPMENT_STATUS.FAILED).slice(0, 5);
    const complaints = failedParcels.map(p => ({
        parcelNo: p.providerTrackingNo,
        shipmentId: p._id,
        status: Math.random() > 0.5 ? "open" : "resolved",
        remarks: "Customer claims they were home.",
        createdBy: admin._id
    }));
    if (complaints.length > 0) {
        await Complaint.insertMany(complaints);
    }

    console.log("✅ Dummy data seeding complete!");
    await mongoose.disconnect();
    process.exit(0);
};

generateData().catch(err => {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
});
