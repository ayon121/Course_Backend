import { model, Schema } from "mongoose";
import { IEvent } from "./event.interface";

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },

    date: {
      startDate: { type: Date, required: true },
      endDate: { type: Date },
    },

    time: {
      startTime: { type: String },
      endTime: { type: String },
    },

    location: {
      address: { type: String, required: true },
      city: { type: String },
      country: { type: String },
      mapLink: { type: String },
    },

    coverPhoto: { type: String, required: true },
    gallery: [{ type: String }],

    category: { type: String },
    tags: [{ type: String }],

    isOnline: { type: Boolean, default: false },
    registrationLink: { type: String },

    status: {
      type: String,
      enum: ["UPCOMING", "ONGOING", "COMPLETED"],
      default: "UPCOMING",
    },
  },
  { timestamps: true }
);

export const Event = model<IEvent>("Event", EventSchema);