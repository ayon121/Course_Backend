/* eslint-disable no-console */
import { envVars } from "../Config/env"
import { IAuthProvider, IUser, Role } from "../Modules/user/user.interface";
import { User } from "../Modules/user/user.model"
import bcrypt from "bcryptjs";

export const SeedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })

        if (isSuperAdminExist) {
            console.log("Super Admin Exists");
            return
        }
        console.log("Try To Create Super Admin ........");

        const hashPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASS, Number(envVars.BCRYPT_SALT))

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerid: envVars.SUPER_ADMIN_EMAIL,
        }

        const payload: IUser = {
            name: "Super Admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            role: Role.SUPER_ADMIN,
            password: hashPassword,
            isVerified: true,
            auths: [authProvider]



        }

        const superadmin = await User.create(payload)
        console.log("Super Admin Created");
        console.log(superadmin);
    } catch (err) {
        console.log(err);
    }
}