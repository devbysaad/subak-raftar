import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../modules/auth/auth.config.js";
import User from "../modules/users/user.model.js";
import { failure } from "../utils/response.utils.js";

const authMiddleware = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session?.user) {
            return res.status(401).json(failure("Unauthorized"));
        }

        const { id: authId, name, email } = session.user;

        let user = await User.findOne({ authId }).lean();

        if (!user) {
            user = await User.findOne({ email: email.toLowerCase() }).lean();

            if (user) {
                await User.updateOne({ _id: user._id }, { $set: { authId } });
                user = { ...user, authId };
            } else {
                try {
                    const created = await User.create({ authId, name, email, role: "employee" });
                    user = created.toObject();
                } catch (createErr) {
                    if (createErr.code === 11000) {
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

export default authMiddleware;
