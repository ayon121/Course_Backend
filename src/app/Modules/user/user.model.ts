import { model, Schema } from "mongoose";
import {
  IAuthProvider,
  IUser,
  IUserPurchasedCourse,
  IsActive,
  Role,
} from "./user.interface";

// -------------------- Auth Provider Schema --------------------
const AuthProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerid: { type: String, required: true },
  },
  {
    _id: false,
    versionKey: false,
  }
);

// -------------------- Purchased Course Schema --------------------
const PurchasedCourseSchema = new Schema<IUserPurchasedCourse>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    lastViewedModuleId: {
      type: Schema.Types.ObjectId,
      ref: "CourseModule",
    },
    courseCompleted: { type: Boolean, default: false },
    courseCompletionDate: { type: Date },
    coursetitle: { type: String, required: true },
    completedModules: [
      {
        type: Schema.Types.ObjectId,
        ref: "CourseModule",
      },
    ],
  },
  {
    _id: false,
    versionKey: false,
  }
);

// -------------------- User Schema --------------------
const UserSchema = new Schema<IUser>(
  {
    // Basic Info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },

    // Auth Providers
    auths: {
      type: [AuthProviderSchema],
      default: [],
    },

    // Role System
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },

    // Status
    isVerified: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isDelete: { type: Boolean, default: false },
    isPasswordNeedChange: { type: Boolean, default: false },

    // Purchased Courses
    purchasedCourses: {
      type: [PurchasedCourseSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", UserSchema);
