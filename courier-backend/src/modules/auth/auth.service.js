import { getAuth } from "./auth.config.js";
import User from "../users/user.model.js";

export const findByAuthId = async (authId) => {
    return User.findOne({ authId }).lean();
};

export const createAuthUser = async ({ name, email, password }) => {
    const auth   = await getAuth();
    const result = await auth.api.signUpEmail({ body: { name, email, password } });
    if (!result?.user?.id) throw new Error(`Failed to create auth user for ${email}`);
    return result.user.id;
};
