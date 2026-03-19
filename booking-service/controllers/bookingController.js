const Booking = require("../models/Booking");
const { validateEvent, updateEvent } = require("../services/eventServiceClient");
// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const now = new Date();
    const event = await validateEvent(req.body.event_id);
    if (!event) {
      return res.status(400).json({ error: "Invalid event_id" });
    }
    const token = req.headers.authorization?.split(" ")[1];

    if (event.isSeated) {
      if (!req.body.seat_number) {
        return res
          .status(400)
          .json({ error: "seat_number is required for seated events" });
      }

      const seatIndex = (event.seats || []).findIndex(
        (seat) => seat.seatNumber === req.body.seat_number,
      );
      if (seatIndex === -1) {
        return res.status(400).json({ error: "Invalid seat selection" });
      }
      if (event.seats[seatIndex].bookingStatus !== "available") {
        return res.status(409).json({ error: "Seat is already reserved/sold" });
      }

      const updatedSeats = [...event.seats];
      updatedSeats[seatIndex] = {
        ...updatedSeats[seatIndex],
        bookingStatus: "reserved",
        reservedUntil: new Date(Date.now() + 10 * 60 * 1000),
        bookingTime: now,
      };

      await updateEvent(event._id, { seats: updatedSeats }, token);
      req.body.ticket_price = updatedSeats[seatIndex].price;
    }

    if (!event.isSeated && typeof req.body.ticket_price !== "number") {
      return res.status(400).json({ error: "ticket_price is required" });
    }

    const bookingData = {
      ...req.body,
      booking_date: now,
      booking_time: now.toTimeString().slice(0, 5),
    };
    const booking = new Booking(bookingData);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a booking by ID
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.event_id && booking.seat_number) {
      const event = await validateEvent(booking.event_id);
      if (event && event.isSeated) {
        const seatIndex = (event.seats || []).findIndex(
          (seat) => seat.seatNumber === booking.seat_number,
        );

        if (seatIndex !== -1) {
          const updatedSeats = [...event.seats];
          updatedSeats[seatIndex] = {
            ...updatedSeats[seatIndex],
            bookingStatus: "available",
            reservedUntil: null,
            bookedBy: null,
            bookingTime: null,
          };

          await updateEvent(event._id, { seats: updatedSeats }, token);
        }
      }
    }

    await booking.deleteOne();
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
