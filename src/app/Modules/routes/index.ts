import { Router } from "express"
import { Userrouter } from "../user/user.route"
import { AuthRoutes } from "../auth/auth.route"

export const router = Router()
const moduleRoutes = [
    {
        path : "/user",
        route : Userrouter
    },
    {
        path : "/auth",
        route : AuthRoutes
    },
]


moduleRoutes.forEach((route) =>{
    router.use(route.path , route.route)
})


