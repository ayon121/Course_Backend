import { Router } from "express"
import { Userrouter } from "../user/user.route"
import { AuthRoutes } from "../auth/auth.route"
import { courseRouter } from "../course/course.route"
import Orderrouter from "../order/order.route"
import { PaymentRoutes } from "../payment/payment.route"
import bannerrouter from "../banner/banner.route"
import { eventRouter } from "../event/event.route"

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
    {
        path : "/order",
        route : Orderrouter
    },
     {
        path: "/payment",
        route: PaymentRoutes
    },
     {
        path: "/banner",
        route: bannerrouter
    },
     {
        path: "/event",
        route: eventRouter
    },
]


moduleRoutes.forEach((route) =>{
    router.use(route.path , route.route)
})


