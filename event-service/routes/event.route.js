import express from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "../controller/event.controller.js";
import { validateAdmin } from "../middleware/validateAdmin.js";

const eventRouter = express.Router();
/**
 * @swagger
 * /event/create:
 *   post:
 *     summary: Create a new event
 *     tags: [Event]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *             example:
 *               _id: "660f1c2e2f8fb814c89b1234"
 *               title: "Demo Event"
 *               description: "This is a test event for Swagger and API validation."
 *               start: "2026-04-10T10:00:00Z"
 *               end: "2026-04-10T13:00:00Z"
 *               location: "Test Hall"
 *               status: "active"
 *               tags: ["demo", "test", "swagger"]
 *               isSeated: true
 *               rows: 2
 *               cols: 2
 *               seatType: "Regular"
 *               seatPrice: 1000
 *               coverImage: "https://example.com/test-cover.jpg"
 *               galleryImages: ["https://example.com/test-gallery1.jpg", "https://example.com/test-gallery2.jpg"]
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid event data"
 */
eventRouter.post("/create", validateAdmin, createEvent);
/**
 * @swagger
 * /event:
 *   get:
 *     summary: Get all events
 *     tags: [Event]
 *     responses:
 *       200:
 *         description: List of all events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *             example:
 *               - _id: "660f1c2e2f8fb814c89b1234"
 *                 title: "Demo Event"
 *                 description: "This is a test event for Swagger and API validation."
 *                 start: "2026-04-10T10:00:00Z"
 *                 end: "2026-04-10T13:00:00Z"
 *                 location: "Test Hall"
 *                 status: "active"
 *                 tags: ["demo", "test", "swagger"]
 *                 isSeated: true
 *                 rows: 2
 *                 cols: 2
 *                 seatType: "Regular"
 *                 seatPrice: 1000
 *                 coverImage: "https://example.com/test-cover.jpg"
 *                 galleryImages: ["https://example.com/test-gallery1.jpg", "https://example.com/test-gallery2.jpg"]
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               message: "Failed to fetch events"
 */
eventRouter.get("/", getEvents);
/**
 * @swagger
 * /event/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *             example:
 *               _id: "660f1c2e2f8fb814c89b1234"
 *               title: "Demo Event"
 *               description: "This is a test event for Swagger and API validation."
 *               start: "2026-04-10T10:00:00Z"
 *               end: "2026-04-10T13:00:00Z"
 *               location: "Test Hall"
 *               status: "active"
 *               tags: ["demo", "test", "swagger"]
 *               isSeated: true
 *               rows: 2
 *               cols: 2
 *               seatType: "Regular"
 *               seatPrice: 1000
 *               coverImage: "https://example.com/test-cover.jpg"
 *               galleryImages: ["https://example.com/test-gallery1.jpg", "https://example.com/test-gallery2.jpg"]
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Event not found"
 */
eventRouter.get("/:id", getEventById);
/**
 * @swagger
 * /event/{id}:
 *   put:
 *     summary: Update event by ID
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *           example:
 *             title: "Updated Demo Event"
 *             description: "This is an updated test event."
 *             start: "2026-04-10T11:00:00Z"
 *             end: "2026-04-10T14:00:00Z"
 *             location: "Updated Hall"
 *             status: "active"
 *             tags: ["demo", "update"]
 *             isSeated: true
 *             rows: 3
 *             cols: 3
 *             seatType: "VIP"
 *             seatPrice: 2000
 *             coverImage: "https://example.com/updated-cover.jpg"
 *             galleryImages: ["https://example.com/updated-gallery1.jpg", "https://example.com/updated-gallery2.jpg"]
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *             example:
 *               _id: "660f1c2e2f8fb814c89b1234"
 *               title: "Updated Demo Event"
 *               description: "This is an updated test event."
 *               start: "2026-04-10T11:00:00Z"
 *               end: "2026-04-10T14:00:00Z"
 *               location: "Updated Hall"
 *               status: "active"
 *               tags: ["demo", "update"]
 *               isSeated: true
 *               rows: 3
 *               cols: 3
 *               seatType: "VIP"
 *               seatPrice: 2000
 *               coverImage: "https://example.com/updated-cover.jpg"
 *               galleryImages: ["https://example.com/updated-gallery1.jpg", "https://example.com/updated-gallery2.jpg"]
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               message: "Failed to update event"
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Event not found"
 */
eventRouter.put("/:id", validateAdmin, updateEvent);
/**
 * @swagger
 * /event/{id}:
 *   delete:
 *     summary: Delete event by ID
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Event deleted successfully"
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Event not found"
 */
eventRouter.delete("/:id", validateAdmin, deleteEvent);

export default eventRouter;
