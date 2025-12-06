import { Router } from "express";
import { EventController } from "./event.controller";

export const eventRouter = Router();

eventRouter.get("/", EventController.getAllEventsController);      // Get all events
eventRouter.get("/:id", EventController.getEventByIdController);   // Get event by ID
eventRouter.post("/", EventController.addEventController);         // Add new event
eventRouter.patch("/:id", EventController.updateEventController);  // Update event
