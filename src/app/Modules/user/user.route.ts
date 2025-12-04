import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../Middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";

import { checkAuth } from "../../Middlewares/CheckAuth";
import { Role } from "./user.interface";



export const Userrouter = Router()




 
Userrouter.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe)
Userrouter.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser)
Userrouter.get("/all-users", checkAuth( Role.ADMIN, Role.SUPER_ADMIN) , UserControllers.getAllUser)
Userrouter.get("/mycourses", checkAuth(...Object.values(Role)), UserControllers.getPurchasedCourses)
Userrouter.patch("/:id", validateRequest(createUserZodSchema) , checkAuth(...Object.values(Role)) , UserControllers.UpdateUser)



