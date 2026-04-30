const { fromNodeHeaders } = require("better-auth/node");
const { auth } = require("../modules/auth/auth.config");
const User = require("../modules/users/user.model");
const { failure } = require("../utils/response.utils");

const authMiddleware = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session?.user) {
            return res.status(401).json(failure("Unauthorized"));
        }

        const { id: authId, name, email } = session.user;

        // ── 1. Try direct authId lookup (fast path, covers 99 % of requests) ──
        let user = await User.findOne({ authId }).lean();

        if (!user) {
            // ── 2. Back-fill: seed may have created the User doc before authId was known
            user = await User.findOne({ email: email.toLowerCase() }).lean();

            if (user) {
                // Patch the authId so future requests skip this branch
                await User.updateOne({ _id: user._id }, { $set: { authId } });
                user = { ...user, authId };
            } else {
                // ── 3. Truly new user — create exactly once
                try {
                    const created = await User.create({ authId, name, email, role: "employee" });
                    user = created.toObject();
                } catch (createErr) {
                    if (createErr.code === 11000) {
                        // Race condition — another request created it simultaneously
                        user =
                            (await User.findOne({ authId }).lean()) ||
                            (await User.findOne({ email: email.toLowerCase() }).lean());
                    } else {
                        throw createErr;
                    }
                }
            }
        }

        if (!user) {
            return res.status(500).json(failure("Could not resolve user from session"));
        }

        if (!user.isActive) {
            return res.status(403).json(failure("Your account has been deactivated"));
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = authMiddleware;
