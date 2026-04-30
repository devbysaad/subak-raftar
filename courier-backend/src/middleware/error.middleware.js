const { failure } = require("../utils/response.utils");

const errorMiddleware = (err, req, res, next) => {
    console.error(`[${req.method}] ${req.path}`, err.message);

    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json(failure("Validation failed", errors));
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        return res.status(409).json(failure(`${field} already exists`));
    }

    if (err.name === "CastError") {
        return res.status(400).json(failure("Invalid ID format"));
    }

    if (err.name === "UnauthorizedError") {
        return res.status(401).json(failure("Invalid or expired token"));
    }

    res.status(err.status || 500).json(failure(err.message || "Internal server error"));
};

module.exports = errorMiddleware;
