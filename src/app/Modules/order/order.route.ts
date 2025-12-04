import { Router } from "express";

import { checkAuth } from "../../Middlewares/CheckAuth";
import { Role } from "../user/user.interface";
import { createOrderController, getMyOrders, getSingleOrder } from "./order.controller";


const Orderrouter = Router();



// for users
Orderrouter.post("/create" , checkAuth(...Object.values(Role)) , createOrderController)
Orderrouter.get ("/my" , checkAuth(...Object.values(Role)), getMyOrders)
Orderrouter.get("/:orderId" , checkAuth(...Object.values(Role)) , getSingleOrder)


export default Orderrouter;