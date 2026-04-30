const User = require("./user.model");

const UPDATABLE_FIELDS = ["name", "phone", "isActive", "role"];

const getAllUsers = async () => {
    return User.find().lean();
};

const getUserById = async (id) => {
    return User.findById(id).lean();
};

const createUser = async ({ name, email, phone, role }) => {
    const exists = await User.findOne({ email: email.toLowerCase() }).lean();
    if (exists) {
        throw Object.assign(new Error("A user with this email already exists"), { status: 409 });
    }
    const user = await User.create({ name, email, phone, role: role || "employee" });
    return user.toObject();
};

const updateUser = async (id, data) => {
    const safeData = {};
    UPDATABLE_FIELDS.forEach((field) => {
        if (data[field] !== undefined) safeData[field] = data[field];
    });

    const updated = await User.findByIdAndUpdate(id, safeData, {
        new: true,
        runValidators: true,
    }).lean();

    if (!updated) throw Object.assign(new Error("User not found"), { status: 404 });
    return updated;
};

const deactivateUser = async (id) => {
    const updated = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    ).lean();

    if (!updated) throw Object.assign(new Error("User not found"), { status: 404 });
    return updated;
};

/**
 * findOrCreateFromAuth — called from auth middleware on first-ever login.
 * Safe: uses findOne first, creates only if not found.
 */
const findOrCreateFromAuth = async ({ authId, name, email }) => {
    let user = await User.findOne({ authId }).lean();
    if (user) return user;

    const created = await User.create({ authId, name, email, role: "employee" });
    return created.toObject();
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deactivateUser,
    findOrCreateFromAuth,
};
