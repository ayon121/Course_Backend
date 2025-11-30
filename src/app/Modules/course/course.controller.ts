/* eslint-disable no-console */
import { Request, Response } from "express";
import { CourseServices } from "./course.service";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";


// Add Course
export const addCourseController = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const decodedToken = req.user as JwtPayload;

  console.log(decodedToken);
  const course = await CourseServices.createCourseService(payload , decodedToken);
  res.status(201).json({ success: true, data: course });
});

// Get All Courses
export const getAllCoursesController = catchAsync(async (req: Request, res: Response) => {
  const courses = await CourseServices.getAllCoursesService(true);
  res.status(200).json({ success: true, ...courses });
});

// Get Single Course
export const getCourseController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const course = await CourseServices.getCourseByIdService(id);
  res.status(200).json({ success: true, data: course });
});

// Update Course
export const updateCourseController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const decodedToken = req.user as JwtPayload;
  const userId = decodedToken.userId; 
  const updatedCourse = await CourseServices.updateCourseService(id, payload, userId);
  res.status(200).json({ success: true, data: updatedCourse });
});

// Delete Course
export const deleteCourseController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const decodedToken = req.user as JwtPayload;
  const userId = decodedToken.userId; 
  const deletedCourse = await CourseServices.deleteCourseService(id, userId);
  res.status(200).json({ success: true, data: deletedCourse });
});
