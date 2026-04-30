import User from "./user.model.js";

const UPDATABLE_FIELDS = ["name", "phone", "isActive", "role"];

export const getAllUsers = async () => {
    return User.find().lean();
};

export const getUserById = async (id) => {
    return User.findById(id).lean();
};

export const createUser = async ({ name, email, phone, role }) => {
    const exists = await User.findOne({ email: email.toLowerCase() }).lean();
    if (exists) {
        throw Object.assign(new Error("A user with this email already exists"), { status: 409 });
    }
    const user = await User.create({ name, email, phone, role: role || "employee" });
    return user.toObject();
};

export const updateUser = async (id, data) => {
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

export const deactivateUser = async (id) => {
    const updated = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    ).lean();

    if (!updated) throw Object.assign(new Error("User not found"), { status: 404 });
    return updated;
};

export const findOrCreateFromAuth = async ({ authId, name, email }) => {
    let user = await User.findOne({ authId }).lean();
    if (user) return user;

    const created = await User.create({ authId, name, email, role: "employee" });
    return created.toObject();
};
