/* eslint-disable @typescript-eslint/no-non-null-assertion */


import { JwtPayload } from "jsonwebtoken";
import AppError from "../../ErrorHelpers/AppError"

import { createNewAcessTokenWithRefreshToken, CreateUserToken } from "../../utils/usertoken";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import bcrypt from "bcryptjs";
import { envVars } from "../../Config/env";

const creadentialLoginService = async (payload: Partial<IUser>) => {
    const { email, password } = payload

    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
        throw new AppError(500, "User Doesn't Exist")
    }

    const isPasswordMatch = await bcrypt.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatch) {
        throw new AppError(500, "Incorrect Password")
    }

    // jwt
    const userTokens = CreateUserToken(isUserExist)


    // delete password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject()
    return {
        accesstoken: userTokens.accesstoken,
        refreshtoken: userTokens.refreshtoken,
        user: rest
    }

}


const getNewAccessToken = async (refreshToken: string) => {

    const newaccesstoken = await createNewAcessTokenWithRefreshToken(refreshToken)


    return {
        accesstoken: newaccesstoken
    }

}
const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)
    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(401, "Old Password does not matched")
    }




    // hashing new password and saving it in the database using save method
    user!.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT))
    user!.save()



    return true

}

export const AuthServices = {
    creadentialLoginService,
    getNewAccessToken,
    resetPassword,
}