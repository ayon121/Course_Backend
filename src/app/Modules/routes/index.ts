import { Router } from "express"
import { Userrouter } from "../user/user.route"
import { AuthRoutes } from "../auth/auth.route"
import { courseRouter } from "../course/course.route"

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
    {
        path : "/course",
        route : courseRouter
    },
]


moduleRoutes.forEach((route) =>{
    router.use(route.path , route.route)
})


