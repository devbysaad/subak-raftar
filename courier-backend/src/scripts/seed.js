// ⚠️  env.js MUST be the very first import
import "./env.js";

import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { createAuthUser } from "../modules/auth/auth.service.js";
import User from "../modules/users/user.model.js";
import Shipment from "../modules/shipments/shipment.model.js";
import StatusHistory from "../modules/status-history/statusHistory.model.js";
import Settings from "../modules/settings/settings.model.js";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error("MONGO_URI not set"); process.exit(1); }

const ADMIN_EMAIL    = "subakraftar@gmail.com";
const ADMIN_PASSWORD = "subakraftar@123";
const ADMIN_NAME     = "Subak Raftar Admin";

const EMPLOYEES = [
    { name: "Ali Hassan",   email: "ali.hassan@subakraftar.com",   password: "employee@123" },
    { name: "Sara Malik",   email: "sara.malik@subakraftar.com",   password: "employee@123" },
    { name: "Umar Farooq",  email: "umar.farooq@subakraftar.com",  password: "employee@123" },
    { name: "Nadia Sheikh", email: "nadia.sheikh@subakraftar.com", password: "employee@123" },
];

const CITIES    = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];
const PROVIDERS = ["tcs", "leopards", "trax", "mp", "self"];
const STATUSES  = ["booked", "received", "in_transit", "out_for_delivery", "delivered", "failed", "cancelled"];
const ITEMS     = ["Clothes", "Electronics", "Books", "Shoes", "Accessories", "Mobile Phone", "Laptop", "Watch", "Cosmetics", "Food Items"];
const NAMES     = ["Ahmed Raza", "Fatima Bibi", "Muhammad Bilal", "Ayesha Khan", "Zain Abidin", "Sana Javed", "Imran Sheikh", "Rabia Noor"];
const STREETS   = ["Block 5 Gulshan", "F-7/3 Near Park", "DHA Phase 6", "Model Town Ext", "Johar Town B-Block", "Clifton Block 2", "G-10 Markaz", "Blue Area"];

const pick  = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const phone = () => `03${rand(10, 49)}${rand(1000000, 9999999)}`;
const tNo   = (p) => `${p.toUpperCase().slice(0, 3)}-${Date.now()}-${rand(1000, 9999)}`;
const addr  = () => ({ name: pick(NAMES), phone: phone(), address: pick(STREETS), city: pick(CITIES) });

async function seed() {
    console.log("\n🌱  Starting seed...\n");

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db();

    await mongoose.connect(MONGO_URI);

    console.log("🗑️   Clearing all collections...");
    await Promise.all([
        User.deleteMany({}),
        Shipment.deleteMany({}),
        StatusHistory.deleteMany({}),
        Settings.deleteMany({}),
        db.collection("user").deleteMany({}),
        db.collection("session").deleteMany({}),
        db.collection("account").deleteMany({}),
        db.collection("verification").deleteMany({}),
    ]);
    console.log("✅  All collections cleared.\n");

    console.log("🔐  Creating admin account...");
    const adminAuthId = await createAuthUser({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    const adminUser   = await User.findOneAndUpdate(
        { email: ADMIN_EMAIL },
        { $set: { authId: adminAuthId, role: "admin", isActive: true } },
        { new: true }
    ).lean();
    console.log(`✅  Admin: ${adminUser.email} (role: admin)\n`);

    console.log("👥  Creating employees...");
    const empDocs = [];
    for (const emp of EMPLOYEES) {
        const empAuthId = await createAuthUser({ name: emp.name, email: emp.email, password: emp.password });
        const doc = await User.findOneAndUpdate(
            { email: emp.email },
            { $set: { authId: empAuthId, role: "employee", isActive: true } },
            { new: true }
        ).lean();
        empDocs.push(doc);
        console.log(`   ✅  ${doc.name}`);
    }

    console.log("\n📦  Seeding shipments...");
    const allUsers = [adminUser, ...empDocs];
    const toInsert = [];

    for (let i = 0; i < 40; i++) {
        const status    = pick(STATUSES);
        const provider  = pick(PROVIDERS);
        const isCOD     = Math.random() > 0.5;
        const createdAt = new Date(Date.now() - rand(0, 30) * 86400000);
        toInsert.push({
            createdBy:          pick(allUsers)._id,
            receiver:           addr(),
            weight:             parseFloat((Math.random() * 9 + 0.5).toFixed(1)),
            itemType:           pick(ITEMS),
            quantity:           rand(1, 5),
            provider,
            providerTrackingNo: tNo(provider),
            status,
            isCOD,
            codAmount:          isCOD ? rand(500, 15000) : 0,
            codStatus:          isCOD ? pick(["pending", "collected", "remitted"]) : "pending",
            notes:              Math.random() > 0.7 ? "Handle with care" : "",
            createdAt,
            updatedAt:          createdAt,
        });
    }

    const inserted = await Shipment.insertMany(toInsert);
    console.log(`✅  ${inserted.length} shipments created.`);

    console.log("\n🕓  Seeding status history...");
    await StatusHistory.insertMany(
        inserted.map((s) => ({
            shipmentId: s._id,
            status:     s.status,
            updatedBy:  s.createdBy,
            note:       "Seeded initial status",
            createdAt:  s.createdAt,
        }))
    );
    console.log(`✅  ${inserted.length} history entries created.`);

    await Settings.create({
        companyName: "Subak Raftar",
        email:       ADMIN_EMAIL,
        phone:       "0311-1234567",
        address:     "Office #12, DHA Phase 6, Karachi",
    });
    console.log("\n✅  Settings seeded.");

    await mongoose.disconnect();
    await client.close();

    console.log("\n┌──────────────────────────────────────────────┐");
    console.log("│  🎉  Seed complete!                           │");
    console.log("│                                               │");
    console.log(`│  Email:    ${ADMIN_EMAIL}        │`);
    console.log(`│  Password: ${ADMIN_PASSWORD}              │`);
    console.log("│  Employee: employee@123                       │");
    console.log("└──────────────────────────────────────────────┘\n");
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌  Seed error:", err);
    process.exit(1);
});
