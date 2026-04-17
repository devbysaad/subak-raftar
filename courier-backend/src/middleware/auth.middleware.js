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

        // findOneAndUpdate with upsert — atomic, never throws duplicate key
        // If the user already exists (by authId OR email) we get it back.
        // We use findOne first so we can distinguish admin role from default 'employee'.
        let user = await User.findOne({ authId }).lean();

        if (!user) {
            // Also try by email in case the seed created the doc before authId was set
            user = await User.findOne({ email: email.toLowerCase() }).lean();

            if (user) {
                // Back-fill the authId so future lookups work via authId
                await User.updateOne({ _id: user._id }, { $set: { authId } });
                user = { ...user, authId };
            } else {
                // Truly new user — create once
                try {
                    const created = await User.create({ authId, name, email });
                    user = created.toObject();
                } catch (createErr) {
                    if (createErr.code === 11000) {
                        // Race condition — another request created it simultaneously
                        user = await User.findOne({ authId }).lean()
                            || await User.findOne({ email: email.toLowerCase() }).lean();
                    } else {
                        throw createErr;
                    }
                }
            }
        }

        if (!user) {
            return res.status(500).json(failure("Could not resolve user from session"));
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = authMiddleware;
