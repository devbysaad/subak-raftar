import { auth } from "../auth/auth.config.js";
import User from "./user.model.js";
import { success, failure } from "../../utils/response.utils.js";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deactivateUser,
} from "./user.service.js";

export const getMe = async (req, res) => {
    res.json(success(req.user));
};

export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(success(users));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role = "employee" } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json(failure("name, email and password are required"));
        }

        let authId;
        try {
            const result = await auth.api.signUpEmail({
                body: { name, email, password },
            });
            authId = result?.user?.id;
        } catch (authErr) {
            const msg = authErr?.message || "Failed to create auth account";
            if (msg.toLowerCase().includes("exist")) {
                return res.status(409).json(failure("A user with this email already exists"));
            }
            return res.status(500).json(failure(msg));
        }

        if (!authId) {
            return res.status(500).json(failure("Auth signup succeeded but returned no user ID"));
        }

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

export const getUserByIdController = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) return res.status(404).json(failure("User not found"));
        res.json(success(user));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

export const updateUserController = async (req, res) => {
    try {
        const user = await updateUser(req.params.id, req.body);
        res.json(success(user));
    } catch (err) {
        res.status(err.status || 500).json(failure(err.message));
    }
};

export const deactivateUserController = async (req, res) => {
    try {
        const user = await deactivateUser(req.params.id);
        res.json(success(user, "User deactivated"));
    } catch (err) {
        res.status(err.status || 500).json(failure(err.message));
    }
};
