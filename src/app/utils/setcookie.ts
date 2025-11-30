import { Response } from "express";

export interface AuthTokens {
    accesstoken ?: string;
    refreshtoken ?: string; 
}
export const setAuthCookie = (res : Response , tokenInfo : AuthTokens) => {
    if(tokenInfo.accesstoken){
         res.cookie("accesstoken" , tokenInfo.accesstoken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        })
    }

    if(tokenInfo.refreshtoken){
        res.cookie("refreshtoken" , tokenInfo.refreshtoken , {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        })
    }
}

