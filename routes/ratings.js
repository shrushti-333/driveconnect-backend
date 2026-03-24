const express = require('express');
const { createRating, getBookingRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createRating);
router.get('/booking/:bookingId', getBookingRatings);

module.exports = router;