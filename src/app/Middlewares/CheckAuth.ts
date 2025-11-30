import { NextFunction, Request, Response } from "express"
import AppError from "../ErrorHelpers/AppError"
import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../Config/env"
import { verifyToken } from "../utils/jwt"
import { User } from "../Modules/user/user.model"
import { IsActive } from "../Modules/user/user.interface"


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accesstoken = req.cookies.accesstoken

        if (!accesstoken) {
            throw new AppError(404, "User Not Verified")
        }
        const verifiedToken = verifyToken(accesstoken, envVars.JWT_SECRET) as JwtPayload
        // // eslint-disable-next-line no-console
        // console.log(verifiedToken);



        if (!verifiedToken) {
            throw new AppError(403, "User Not Verified")
        }
        const isUserExist = await User.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(500, "User Doesn't Exist")
        }

        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(500, `User is ${isUserExist.isActive}`)
        }
        if (isUserExist.isDelete) {
            throw new AppError(500, "User is Deleted")
        }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "User Not Permitted")
        }

        req.user = verifiedToken
        next()

    } catch (err) {
        next(err)
    }


}