const User = require("./user.model");

const UPDATABLE_FIELDS = ["name", "phone", "isActive"];

const getAllUsers = async (companyId) => {
    const filter = companyId ? { companyId } : {};
    return User.find(filter).lean();
};

const getUserById = async (id, companyId) => {
    const filter = companyId ? { _id: id, companyId } : { _id: id };
    return User.findOne(filter).lean();
};

const updateUserInCompany = async (id, companyId, data) => {
    const safeData = {};
    UPDATABLE_FIELDS.forEach((field) => {
        if (data[field] !== undefined) safeData[field] = data[field];
    });

    const filter = companyId ? { _id: id, companyId } : { _id: id };

    const updated = await User.findOneAndUpdate(filter, safeData, {
        new: true,
        runValidators: true,
    }).lean();

    if (!updated) throw new Error("User not found or access denied");
    return updated;
};

const deactivateUser = async (id, companyId) => {
    const filter = companyId ? { _id: id, companyId } : { _id: id };

    const updated = await User.findOneAndUpdate(
        filter,
        { isActive: false },
        { new: true }
    ).lean();

    if (!updated) throw new Error("User not found or access denied");
    return updated;
};

const findOrCreateFromAuth = async ({ authId, name, email, role, companyId }) => {
    let user = await User.findOne({ authId }).lean();
    if (user) return user;

    user = await User.create({ authId, name, email, role, companyId });
    return user.toObject();
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserInCompany,
    deactivateUser,
    findOrCreateFromAuth,
};