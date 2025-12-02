/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import AppError from "../../ErrorHelpers/AppError";
import { ICourse, ICourseModule } from "./course.interface";
import { Course } from "./course.model";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createCourseService = async (payload: Partial<ICourse>, decodedToken: JwtPayload) => {
    const {
        title,
        description,
        duration,
        instructor,
        banner,
        price,
        discountedPrice,
        modules,
        category,
        tags,
        isPublished = false,
    } = payload;

    if (!title || !description || !duration || !instructor || !banner || !price) {
        throw new AppError(400, "Missing required course fields");
    }

    // Map modules carefully if provided
    const sanitizedModules: ICourseModule[] = Array.isArray(modules)
        ? modules.map((mod) => ({
            title: mod.title,
            videoLink: mod.videoLink,
            isPublic: mod.isPublic ?? false,
            rank: mod.rank ?? 0,
        }))
        : [];

    const course = await Course.create({
        title,
        description,
        duration,
        instructor,
        banner,
        price,
        discountedPrice: discountedPrice || 0,
        modules: sanitizedModules,
        category: category || "",
        tags: tags || [],
        createdBy: decodedToken.userId, 
        isPublished,
        isDeleted: false,
    });

    return course;
};

// Get all courses (optionally only published)
export const getAllPublishedCoursesService = async (query: Record<string, any>) => {
  // Force filter only published courses
  const baseQuery = Course.find({ isPublished: true });

  const courseQuery = new QueryBuilder(baseQuery, query)
    .filter()
    .search(["title", "description", "instructor", "category"]) // adjust fields as needed
    .sort()
    .fields()
    .paginate()
    .build();

  // Execute data query
  const data = await courseQuery;

  // Get pagination + meta
  const meta = await new QueryBuilder(Course.find({ isPublished: true }), query)
    .filter()
    .search(["title", "description", "instructor", "category"])
    .getMeta();

  return {
    meta,
    data,
  };
};

// Get all courses for admin (including unpublished)
const getAllCoursesAdminService = async () => {
    const filter: any = { isDeleted: false };

    const courses = await Course.find(filter)
        .select("title description banner category isPublished createdAt")
        .sort({ createdAt: -1 });

    const totalCourses = await Course.countDocuments(filter);

    return {
        data: courses,
        meta: { total: totalCourses },
    };
};

// Get single course by ID
const getCourseByIdService = async (courseId: string) => {
    if (!Types.ObjectId.isValid(courseId)) {
        throw new AppError(400, "Invalid course ID");
    }

    const course = await Course.findById(courseId);
    if (!course) throw new AppError(404, "Course not found");

    return course;
};


// Get single course by ID for PUBLIC access (ONLY published course)
const getCourseByIdPublicService = async (courseId: string) => {
    if (!Types.ObjectId.isValid(courseId)) {
        throw new AppError(400, "Invalid course ID");
    }

    // Only return course if isPublished = true and not deleted
    const course = await Course.findOne({
        _id: courseId,
        isPublished: true,
        isDeleted: false,
    });

    if (!course) {
        throw new AppError(404, "Course not found or not published");
    }

    return course;
};

// Update course with modules
const updateCourseService = async (
    courseId: string,
    payload: Partial<ICourse>,
    userId: string
) => {
    if (!Types.ObjectId.isValid(courseId)) {
        throw new AppError(400, "Invalid course ID");
    }

    const course = await Course.findById(courseId);
    if (!course) throw new AppError(404, "Course not found");

    if (userId && course.createdBy.toString() !== userId) {
        throw new AppError(403, "Not authorized to update this course");
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, payload, {
        new: true,
        runValidators: true,
    });

    return updatedCourse;
};

// Soft delete course
const deleteCourseService = async (courseId: string, userId?: string) => {
    if (!Types.ObjectId.isValid(courseId)) {
        throw new AppError(400, "Invalid course ID");
    }

    const course = await Course.findById(courseId);
    if (!course) throw new AppError(404, "Course not found");

    if (userId && course.createdBy.toString() !== userId) {
        throw new AppError(403, "Not authorized to delete this course");
    }

    course.isPublished = false;
    course.isDeleted = true;
    await course.save();

    return course;
};

const updatePublishStatus = async (courseId: string, isPublished: boolean) => {
    const course = await Course.findById(courseId);

    if (!course) throw new AppError(404, "Course not found");

    course.isPublished = isPublished;
    await course.save();

    return course;
};

export const CourseServices = {
    createCourseService,
    getAllPublishedCoursesService,
    getCourseByIdService,
    updateCourseService,
    deleteCourseService,
    getAllCoursesAdminService,
    updatePublishStatus,
    getCourseByIdPublicService
};
