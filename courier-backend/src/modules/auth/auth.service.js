const User = require("../users/user.model");

const getUserWithCompany = async (authId) => {
  return User.findOne({ authId }).populate("companyId").lean();
};


const createUserForCompany = async ({ authId, name, email, role, companyId }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("User with this email already exists");

  return User.create({ authId, name, email, role, companyId });
};

module.exports = { getUserWithCompany, createUserForCompany };