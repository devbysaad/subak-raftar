const { fromNodeHeaders } = require("better-auth/node");
const { auth } = require("../modules/auth/auth.config");
const User = require("../modules/users/user.model");
const { failure } = require("../utils/response.utils");
const { ROLES } = require("../config/constants");

const authMiddleware = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session?.user) {
            return res.status(401).json(failure("Unauthorized"));
        }

        let user = await User.findOne({ authId: session.user.id }).lean();

        if (!user) {
            user = await User.create({
                authId: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: ROLES.CUSTOMER,
            });
            user = user.toObject();
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = authMiddleware;
