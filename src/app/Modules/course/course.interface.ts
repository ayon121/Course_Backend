import { Types } from "mongoose";

// ________________________
// Module Interface
// Matches EXACTLY with your Frontend State
// title, videoLink, isPublic, rank
// ________________________
export interface ICourseModule {
  _id?: Types.ObjectId;
  title: string;
  videoLink: string;
  isPublic: boolean;
  rank: number;
}

// ________________________
// Main Course Interface
// Fully compatible with your AddCoursePage form
// ________________________
export interface ICourse {
  _id?: Types.ObjectId;

  // Basic Fields
  title: string;
  description: string;
  duration: string;
  instructor: string;

  // Banner
  // Frontend now uses a banner link input
  // Later you may attach a real file upload
  banner: string;

  // Pricing
  price: number;
  discountedPrice: number; // if 0 → no discount applied

  // Modules
  modules: ICourseModule[];

  // Optional Fields for future features
  category?: string;
  tags?: string[];

  // Admin Control
  createdBy: Types.ObjectId; // SUPER_ADMIN / ADMIN ID
  isPublished: boolean;      // show in frontend
  isDeleted: boolean;        // soft delete

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}
