/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { EventServices } from "./event.service";

const getAllEventsController = async (req: Request, res: Response) => {
  try {
    const { data, meta } = await EventServices.getAllEvents(req.query as any);
    res.status(200).json({ success: true, data, meta });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getEventByIdController = async (req: Request, res: Response) => {
  try {
    const event = await EventServices.getEventById(req.params.id);
    res.status(200).json({ success: true, data: event });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const addEventController = async (req: Request, res: Response) => {
  try {
    const event = await EventServices.addEvent(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const updateEventController = async (req: Request, res: Response) => {
  try {
    const event = await EventServices.updateEvent(req.params.id, req.body);
    res.status(200).json({ success: true, data: event });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const EventController = {
  getAllEventsController,
  getEventByIdController,
  addEventController,
  updateEventController,
};
