const express = require('express');
const { createBooking, getBookings, getBookingById, confirmPayment, cancelBooking } = require('../controllers/bookingController');
const { protect, isTraveler } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, isTraveler, createBooking);
router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/confirm-payment', protect, confirmPayment);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;