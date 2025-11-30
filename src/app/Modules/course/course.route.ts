import { Router } from "express";
import {
  addCourseController,
  getAllCoursesController,
  getCourseController,
  updateCourseController,
  deleteCourseController,
} from "./course.controller";
import { checkAuth } from "../../Middlewares/CheckAuth";
import { Role } from "../user/user.interface";


export const courseRouter = Router();

// Public
courseRouter.get("/", getAllCoursesController);
courseRouter.get("/:id", getCourseController);

// Protected: Admin / Super Admin
courseRouter.post("/addcourse", checkAuth( Role.ADMIN, Role.SUPER_ADMIN), addCourseController);
courseRouter.put("/updatecourse/:id", checkAuth( Role.ADMIN, Role.SUPER_ADMIN), updateCourseController);
courseRouter.delete("/deletecourse/:id", checkAuth( Role.ADMIN, Role.SUPER_ADMIN), deleteCourseController);
