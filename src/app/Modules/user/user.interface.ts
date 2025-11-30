import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}

// Where user logged in from
export interface IAuthProvider {
  provider: "google" | "credentials";
  providerid: string; // googleId / internalId
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

// Track each course user has bought
export interface IUserPurchasedCourse {
  courseId: Types.ObjectId;
  purchasedAt: Date;
  progress: number; // overall progress %, 0–100
  lastViewedModuleId?: Types.ObjectId;
  completedModules: Types.ObjectId[]; // store completed module IDs
}

// Main User Interface
export interface IUser {
  _id?: Types.ObjectId;

  // Basic Info
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;

  // Auth System
  auths: IAuthProvider[];
  role: Role;

  // Status
  isVerified: boolean;
  isActive: IsActive;
  isDelete: boolean;
  isPasswordNeedChange: boolean;

  // Course System
  purchasedCourses: IUserPurchasedCourse[];

  createdAt?: Date;
  updatedAt?: Date;
}
