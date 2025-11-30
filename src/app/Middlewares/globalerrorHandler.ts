/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../Config/env"
import AppError from "../ErrorHelpers/AppError"

export const GlobalErrorHandler = (err: any, req: Request, res: Response , next : NextFunction)  => {
    
    let statusCode = 500
    let message = `Something Went Wrong!!${err.message} From Global Error`


    // Duplicate Error
    if (err.code === 11000){
        statusCode = 400
        const duplicatearray = err.mesaage.match(/"([^"]*)"/)
        message = `${duplicatearray[1]} already Exits`
    }

    // Cast Error / Object Error
    else if (err.name === "CastError" ){
        statusCode = 400
        message = "Invalid Object Id , Please Provide Valid Id"
    }
    else if (err.name === "ZodError" ){
        statusCode = 400
        message = "ZodError"
    }
    else if (err.name === "ValidationError" ){
        statusCode = 400
        message = "Validation Error Occoured"
    }
    else if (err instanceof AppError ){
        statusCode = err.statusCode
        message = err.message
    }else if(err instanceof Error){
        statusCode = 500
        message = err.message
    }
    res.status(statusCode).json({
        success: false,
        message, 
        err,
        stack : envVars.NODE_ENV == "development" ? err.stack : null
    
    })
}