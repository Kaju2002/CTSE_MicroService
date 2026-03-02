import express from "express";
import { createEvent, deleteEvent, getEventById, getEvents, updateEvent } from "../controller/event.controller.js";


const eventRouter = express.Router();

eventRouter.post("/create", createEvent);
eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEventById);
eventRouter.put("/:id", updateEvent);
eventRouter.delete("/:id", deleteEvent);

export default eventRouter;
