/* eslint-disable no-console */
import { Request, Response } from "express";
import { CourseServices, getAllPublishedCoursesService } from "./course.service";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utils/sendResponse";


// Add Course
export const addCourseController = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const decodedToken = req.user as JwtPayload;

  console.log(decodedToken);
  const course = await CourseServices.createCourseService(payload , decodedToken);
  res.status(201).json({ success: true, data: course });
});

// Get All Courses
export const getAllPublishedCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllPublishedCoursesService(req.query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Published courses retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// Get All Courses for Admin
export const getAllCoursesAdminController = catchAsync(async (req: Request, res: Response) => {
  const courses = await CourseServices.getAllCoursesAdminService();
  res.status(200).json({ success: true, ...courses });
});

// Get Single Course for Admin
export const getCourseController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const course = await CourseServices.getCourseByIdService(id);
  res.status(200).json({ success: true, data: course });
});
// Get Single Course for Public
export const getCoursebyidPublicController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const course = await CourseServices.getCourseByIdPublicService(id);
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


export const updateCoursePublishController = catchAsync(async (req: Request, res: Response) => {
    const courseId = req.params.id;
    const { isPublished } = req.body;

    const updatedCourse = await CourseServices.updatePublishStatus(courseId, isPublished);

    res.status(200).json({
        success: true,
        message: `Course is now ${isPublished ? "published" : "unpublished"}`,
        data: updatedCourse,
    });
});