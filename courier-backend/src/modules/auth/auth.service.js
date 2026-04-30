const User = require("../users/user.model");

const findByAuthId = async (authId) => {
    return User.findOne({ authId }).lean();
};

module.exports = { findByAuthId };
