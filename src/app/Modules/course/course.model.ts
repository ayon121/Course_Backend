import { model, Schema } from "mongoose";
import { ICourse, ICourseModule } from "./course.interface";

// Module Schema
const CourseModuleSchema = new Schema<ICourseModule>(
  {
    title: { type: String, required: true },
    videoLink: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    rank: { type: Number, default: 0 },
  },
  { _id: true }
);

// Course Schema
const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    instructor: { type: String, required: true },
    banner: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number, default: 0 },
    modules: [CourseModuleSchema],
    category: { type: String },
    tags: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPublished: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Course = model<ICourse>("Course", CourseSchema);
