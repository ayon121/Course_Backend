import { Router } from "express";
import {
  addCourseController,
  getAllCoursesController,
  getCourseController,
  updateCourseController,
  deleteCourseController,
  getAllCoursesAdminController,
  updateCoursePublishController,
} from "./course.controller";
import { checkAuth } from "../../Middlewares/CheckAuth";
import { Role } from "../user/user.interface";


export const courseRouter = Router();

// Public
courseRouter.get("/", getAllCoursesController);
// Admin / Super Admin
courseRouter.get("/allcourseadmin", checkAuth( Role.ADMIN, Role.SUPER_ADMIN), getAllCoursesAdminController);

courseRouter.get("/:id", getCourseController);

// Protected: Admin / Super Admin
courseRouter.post("/addcourse", checkAuth( Role.ADMIN, Role.SUPER_ADMIN), addCourseController);
// PATCH /api/v1/course/updatepublish/:id
courseRouter.patch("/updatepublish/:id", checkAuth( Role.ADMIN, Role.SUPER_ADMIN), updateCoursePublishController);

courseRouter.put("/updatecourse/:id", checkAuth( Role.ADMIN, Role.SUPER_ADMIN), updateCourseController);
courseRouter.delete("/deletecourse/:id", checkAuth( Role.ADMIN, Role.SUPER_ADMIN), deleteCourseController);
