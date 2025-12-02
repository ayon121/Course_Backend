

import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../Config/env";
import AppError from "../../ErrorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { CreateUserToken } from "../../utils/usertoken";

const createUserService = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    if (!email) {
        throw new AppError(400, "Email is required");
    }
    if (!password) {
        throw new AppError(400, "Password is required");
    }

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new AppError(409, "User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(
        password,
        Number(envVars.BCRYPT_SALT)
    );

    const authProvider: IAuthProvider = {
        provider: "credentials",
        providerid: email,
    };

    

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest,
    });
    const userTokens = CreateUserToken(user)

    return {
        accesstoken: userTokens.accesstoken,
        refreshtoken: userTokens.refreshtoken,
        user: rest
    }
};

const getAllUserService = async () => {
    const users = await User.find({})

    const totalUsers = await User.countDocuments()

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}


const UpdateUserService = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(401, "User Not Found")
    }

    /**
     * email - can not update
     * name, phone, password address
     * password - re hashing
     *  only admin superadmin - role, isDeleted...
     * 
     * promoting to superadmin - superadmin
     */

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.MODERATOR) {
            throw new AppError(401, "You are not authorized");
        }

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(401, "You are not authorized");
        }
    }

    if (payload.isActive || payload.isDelete || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.MODERATOR || decodedToken.role === Role.ADMIN) {
            throw new AppError(401, "You are not authorized");
        }
    }

    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, Number(envVars.BCRYPT_SALT))
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}

const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};


export const UserServices = {
    createUserService,
    getAllUserService,
    UpdateUserService,
    getMe
}


//route => controllers => service => model => DB