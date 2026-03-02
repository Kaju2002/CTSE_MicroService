const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/', bookingController.createBooking);

// Get all bookings
router.get('/', bookingController.getBookings);

// Get a booking by booking_id
router.get('/:id', bookingController.getBookingById);

// Update a booking by booking_id
router.put('/:id', bookingController.updateBooking);

// Delete a booking by booking_id
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
