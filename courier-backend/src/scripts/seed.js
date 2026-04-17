/**
 * Seed script — creates the single admin account for Subak Raftar.
 * Run once: node src/scripts/seed.js
 */
require("dotenv").config();
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("❌  MONGO_URI is not set in .env");
    process.exit(1);
}

const ADMIN_EMAIL    = "subakraftar@gmail.com";
const ADMIN_PASSWORD = "subakraftar@123";
const ADMIN_NAME     = "Subak Raftar Admin";

async function seed() {
    console.log("🌱  Seeding admin account...\n");

    // ── 1. Call the running server's REST sign-up endpoint ──────────────────
    // We use fetch (Node 18+) to hit the better-auth endpoint directly.
    // If the server is not running, start it first.

    const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

    let signUpRes;
    try {
        signUpRes = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": `http://localhost:${process.env.PORT || 5000}`,
            },
            body: JSON.stringify({
                name:     ADMIN_NAME,
                email:    ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
            }),
        });
    } catch (err) {
        console.error("❌  Could not reach the server. Make sure 'npm run dev' is running first.");
        process.exit(1);
    }

    const signUpData = await signUpRes.json();

    if (!signUpRes.ok) {
        if (signUpData?.message?.toLowerCase().includes("already")) {
            console.log("⚠️   Admin account already exists in better-auth — skipping sign-up.");
        } else {
            console.error("❌  Sign-up failed:", signUpData);
            process.exit(1);
        }
    } else {
        console.log("✅  better-auth user created:", signUpData?.user?.id || signUpData?.user?.email);
    }

    // ── 2. Elevate the user to 'admin' role in our User collection ───────────
    await mongoose.connect(MONGO_URI);
    const User = require("../modules/users/user.model");

    const updated = await User.findOneAndUpdate(
        { email: ADMIN_EMAIL },
        { role: "admin", isActive: true },
        { new: true }
    );

    if (!updated) {
        // The auth middleware creates the User doc on first login — do it manually here
        const betterAuthDb = new MongoClient(MONGO_URI);
        await betterAuthDb.connect();
        const authUser = await betterAuthDb.db().collection("user").findOne({ email: ADMIN_EMAIL });
        await betterAuthDb.close();

        if (!authUser) {
            console.error("❌  Could not find the better-auth user document. Check MONGO_URI.");
            process.exit(1);
        }

        await User.create({
            authId:   authUser.id,
            name:     ADMIN_NAME,
            email:    ADMIN_EMAIL,
            role:     "admin",
            isActive: true,
        });
        console.log("✅  User document created in app collection with role: admin");
    } else {
        console.log("✅  User elevated to admin:", updated.email, "→ role:", updated.role);
    }

    // ── 3. Upsert the singleton Settings document ────────────────────────────
    const Settings = require("../modules/settings/settings.model");
    await Settings.findOneAndUpdate(
        {},
        { companyName: "Subak Raftar", email: ADMIN_EMAIL },
        { upsert: true, new: true }
    );
    console.log("✅  Settings document seeded.");

    await mongoose.disconnect();
    console.log("\n🎉  Done! You can now log in with:");
    console.log("    Email:    " + ADMIN_EMAIL);
    console.log("    Password: " + ADMIN_PASSWORD);
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌  Seed error:", err);
    process.exit(1);
});
