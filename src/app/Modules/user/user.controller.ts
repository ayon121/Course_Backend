/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";




const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserServices.createUserService(req.body);

    return sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const UpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userId = req.params.id
        const payload = req.body
        const verified = req.user;

        const user = await UserServices.UpdateUserService(userId , payload , verified as JwtPayload)

        sendResponse(res , {
            success : true,
            statusCode : 201,
            message : "User Created Successfully",
            data : user,

        })


        
    } catch (err: any) {
        console.log(err);
        next(err)


    }

}


const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserServices.getAllUserService()
        sendResponse(res , {
            success : true,
            statusCode : 201,
            message : "User Created Successfully",
            data : result.data,
            meta : result.meta,
        })


    } catch (err: any) {
    
        console.log(err);
        next(err)


    }
}

const getMe = catchAsync(async (req: Request, res: Response) => {
    const decodedtoken = req.user as JwtPayload
    const result = await UserServices.getMe(decodedtoken.userId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })
})

export const UserControllers = {
    createUser,
    getAllUser,
    UpdateUser,
    getMe
}