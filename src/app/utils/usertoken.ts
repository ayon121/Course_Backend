import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../Config/env";
import AppError from "../ErrorHelpers/AppError";
import { IsActive, IUser } from "../Modules/user/user.interface";
import { User } from "../Modules/user/user.model";
import { createToken, verifyToken } from "./jwt";

export const CreateUserToken = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const accesstoken = createToken(jwtPayload, envVars.JWT_SECRET, envVars.Jwt_ACCESS_EXPIRES)

    const refreshtoken = createToken(jwtPayload, envVars.Jwt_REFRESH_SECRET, envVars.Jwt_REFRESH_EXPRIES)

    return {
        accesstoken,
        refreshtoken
    }
}


export const createNewAcessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.Jwt_REFRESH_SECRET) as JwtPayload

    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(500, "User Doesn't Exist")
    }

    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(500, `User is ${isUserExist.isActive}`)
    }
    if (isUserExist.isDelete) {
        throw new AppError(500, "User is Deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accesstoken = createToken(jwtPayload, envVars.JWT_SECRET, envVars.Jwt_ACCESS_EXPIRES)

    return accesstoken

}