const userService = require("./user.service");
const { auth } = require("../auth/auth.config");
const User = require("./user.model");
const { success, failure } = require("../../utils/response.utils");

// GET /api/users/me
const getMe = async (req, res) => {
    res.json(success(req.user));
};

// GET /api/users — admin only
const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(success(users));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

// POST /api/users — admin creates employee
// Uses better-auth programmatic API then creates our User doc
const createUser = async (req, res) => {
    try {
        const { name, email, password, role = "employee" } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json(failure("name, email and password are required"));
        }

        // 1. Create the auth account via better-auth's programmatic API
        let authId;
        try {
            const result = await auth.api.signUpEmail({
                body: { name, email, password },
            });
            authId = result?.user?.id;
        } catch (authErr) {
            // better-auth throws if email already exists
            const msg = authErr?.message || "Failed to create auth account";
            if (msg.toLowerCase().includes("exist")) {
                return res.status(409).json(failure("A user with this email already exists"));
            }
            return res.status(500).json(failure(msg));
        }

        if (!authId) {
            return res.status(500).json(failure("Auth signup succeeded but returned no user ID"));
        }

        // 2. Create our User doc (upsert by authId to be safe)
        let user = await User.findOne({ authId });
        if (!user) {
            user = await User.create({ authId, name, email: email.toLowerCase(), role, isActive: true });
        } else {
            user.role = role;
            await user.save();
        }

        res.status(201).json(success(user.toObject(), "User created successfully"));
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json(failure("A user with this email already exists"));
        }
        res.status(err.status || 500).json(failure(err.message));
    }
};

// GET /api/users/:id — admin only
const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json(failure("User not found"));
        res.json(success(user));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

// PATCH /api/users/:id — admin only
const updateUser = async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.json(success(user));
    } catch (err) {
        res.status(err.message.includes("not found") ? 404 : 500).json(failure(err.message));
    }
};

// PATCH /api/users/:id/deactivate — admin only
const deactivateUser = async (req, res) => {
    try {
        const user = await userService.deactivateUser(req.params.id);
        res.json(success(user, "User deactivated"));
    } catch (err) {
        res.status(err.message.includes("not found") ? 404 : 500).json(failure(err.message));
    }
};

module.exports = { getMe, getUsers, createUser, getUserById, updateUser, deactivateUser };