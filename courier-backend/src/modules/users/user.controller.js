const userService = require("./user.service");
const { success, failure } = require("../../utils/response.utils");

// Returns the currently authenticated user (set by authMiddleware)
const getMe = async (req, res) => {
    try {
        res.json(success(req.user));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

const getUsers = async (req, res) => {

    try {
        const users = await userService.getAllUsers(req.user.companyId);
        res.json(success(users));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id, req.user.companyId);
        if (!user) return res.status(404).json(failure("User not found"));
        res.json(success(user));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await userService.updateUserInCompany(
            req.params.id,
            req.user.companyId,
            req.body
        );
        res.json(success(user));
    } catch (err) {
        const status = err.message.includes("not found") ? 404 : 500;
        res.status(status).json(failure(err.message));
    }
};

const deactivateUser = async (req, res) => {
    try {
        const user = await userService.deactivateUser(req.params.id, req.user.companyId);
        res.json(success(user));
    } catch (err) {
        const status = err.message.includes("not found") ? 404 : 500;
        res.status(status).json(failure(err.message));
    }
};

module.exports = { getMe, getUsers, getUserById, updateUser, deactivateUser };