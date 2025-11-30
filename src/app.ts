/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from "cors";
import cookie from "cookie-parser";
import express, { Request, Response } from "express";
import { router } from "./app/Modules/routes";

import { GlobalErrorHandler } from "./app/Middlewares/globalerrorHandler";
import notFound from "./app/Middlewares/notFound";
import passport from "passport";
import expressSession from "express-session"

import "./app/Config/passport"
import { envVars } from "./app/Config/env";


const app = express()

app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(cookie())
app.use(cors())   


app.use("/api/v1/", router)


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Backend"
    })
})


app.use(GlobalErrorHandler)


app.use(notFound)

export default app