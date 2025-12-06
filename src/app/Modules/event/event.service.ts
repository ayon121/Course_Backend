/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event } from "./event.model";
import mongoose from "mongoose";
import AppError from "../../ErrorHelpers/AppError";
import { IEvent } from "./event.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getAllEvents = async (query: Record<string, string>): Promise<{ data: IEvent[]; meta: any }> => {
    // Build query using QueryBuilder
    const qb = new QueryBuilder(Event.find(), query)
        .filter()
        .search(["title", "shortDescription", "description", "category", "tags"])
        .sort()
        .fields()
        .paginate();

    const data = await qb.build();
    const meta = await qb.getMeta();

    return { data, meta };
};

const getEventById = async (id: string): Promise<IEvent> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(404, "Invalid Event ID");
    }
    const event = await Event.findById(id).lean();
    if (!event) {
        throw new AppError(404, "Event not found");
    }
    return event;
};

const addEvent = async (eventData: IEvent): Promise<IEvent> => {
    const event = new Event(eventData);
    return event.save();
};

const updateEvent = async (id: string, eventData: Partial<IEvent>): Promise<IEvent> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(404, "Invalid Event ID");
    }
    const event = await Event.findByIdAndUpdate(id, eventData, { new: true }).lean();
    if (!event) {
        throw new AppError(404, "Event not found");
    }
    return event;
};

export const EventServices = {
    getAllEvents,
    getEventById,
    addEvent,
    updateEvent,
};
