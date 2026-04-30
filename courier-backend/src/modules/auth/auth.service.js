import User from "../users/user.model.js";

export const findByAuthId = async (authId) => {
    return User.findOne({ authId }).lean();
};
