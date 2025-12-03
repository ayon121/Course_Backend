import { Router } from "express";

import { checkAuth } from "../../Middlewares/CheckAuth";
import { Role } from "../user/user.interface";
import { createOrderController } from "./order.controller";


const Orderrouter = Router();



// for users
Orderrouter.post("/create" , checkAuth(...Object.values(Role)) , createOrderController)


export default Orderrouter;