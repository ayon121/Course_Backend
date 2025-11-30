/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import AppError from "../../ErrorHelpers/AppError";
import { setAuthCookie } from "../../utils/setcookie";
import { JwtPayload } from "jsonwebtoken";
import { CreateUserToken } from "../../utils/usertoken";
import { envVars } from "../../Config/env";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";

const creadentialLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // from service login system
        // const loginInfo = await AuthServices.creadentialLoginService(req.body)

        // from passport login system
        passport.authenticate("local", async (err : any , user : any , info : any ) => {

            if(err){
                return next(err)
            }

            if(!user){
                return next(new AppError(401 , info.message))
            }

            const userTokens = CreateUserToken(user)
            const { password: pass, ...rest } = user.toObject()

            setAuthCookie(res, userTokens)

            sendResponse(res, {
                success: true,
                statusCode: 201,
                message: "User Logged In Successfully",
                data: {
                    accesstoken : userTokens.accesstoken, 
                    refreshtoken : userTokens.refreshtoken,
                    user: rest

                }
            })

        })(req , res, next)


        // // saving cookie in the frontend browser
        // res.cookie("refreshtoken" , loginInfo.refreshToken , {
        //     httpOnly : true,
        //     secure : false
        // })
        // res.cookie("accesstoken" , loginInfo.accesstoken, {
        //     httpOnly : true,
        //     secure : false
        // })


    } catch (err: any) {
        console.log(err);
        next(err)
    }
}



const getNewAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshtoken;

        if (!refreshToken) {
            throw new AppError(500, "No Refresh Token")
        }
        const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

        setAuthCookie(res, tokenInfo)

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "New Access Token Retrive Successfully",
            data: tokenInfo
        })
    } catch (err: any) {
        console.log(err);
        next(err)
    }
}


const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("accesstoken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })
        res.clearCookie("refreshtoken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "User Logged out Successfully",
            data: null
        })
    } catch (err: any) {
        console.log(err);
        next(err)
    }
}




const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {


        const newPassword = req.body.newPassword;
        const oldPassword = req.body.oldPassword;
        const decodedToken = req.user


        await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Password Changed Successfully",
            data: null
        })
    } catch (err: any) {
        console.log(err);
        next(err)
    }
}
const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    // /booking => booking , => "/" => ""
    const user = req.user;

    if (!user) {
        throw new AppError(404, "User Not Found")
    }

    const tokenInfo = CreateUserToken(user)

    setAuthCookie(res, tokenInfo)

    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "Password Changed Successfully",
    //     data: null,
    // })

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})
export const AuthControllers = {
    creadentialLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}