const { failure } = require("../utils/response.utils");

const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json(failure("Unauthorized"));
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json(failure("Forbidden"));
        }

        next();
    };
};

module.exports = { requireRole };
