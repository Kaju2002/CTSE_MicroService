import Event from "../model/event.model.js";
import { generateSeats } from "../utils/seatGenerator.js";

export async function createEvent(req, res) {
  try {
    const {
      title,
      start,
      end,
      isSeated,
      rows,
      cols,
      seatType,
      seatPrice,
      ...rest
    } = req.body;

    // Basic validation
    if (!title || !start || !end) {
      return res
        .status(400)
        .json({ message: "Title, start, and end are required." });
    }
    if (new Date(end) <= new Date(start)) {
      return res
        .status(400)
        .json({ message: "End date must be after start date." });
    }
    let seats = [];
    if (isSeated) {
      if (!rows || !cols || rows < 1 || cols < 1) {
        return res.status(400).json({
          message:
            "Rows and columns must be positive numbers for seated events.",
        });
      }
      seats = generateSeats(
        rows,
        cols,
        seatType || "Regular",
        seatPrice || 2000,
      );
    }

    const event = new Event({
      title,
      start,
      end,
      isSeated,
      seats,
      ...rest,
    });

    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getEvents(req, res) {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getEventById(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      start,
      end,
      location,
      status,
      tags,
      isSeated,
      seats,
      coverImage,
      galleryImages,
    } = req.body;

    // Validate date logic if both provided
    if (start && end && new Date(end) <= new Date(start)) {
      return res
        .status(400)
        .json({ message: "End date must be after start date." });
    }

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(start && { start }),
      ...(end && { end }),
      ...(location && { location }),
      ...(status && { status }),
      ...(tags && { tags }),
      ...(isSeated !== undefined && { isSeated }),
      ...(seats && { seats }),
      ...(coverImage && { coverImage }),
      ...(galleryImages && { galleryImages }),
    };

    const event = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


// Delete Event Controller
export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}