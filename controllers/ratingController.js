const Rating = require('../models/Rating');

exports.createRating = async (req, res, next) => {
  try {
    const { bookingId, rating, review, ratingFrom } = req.body;

    let ratingRecord = await Rating.findOne({ bookingId });
    if (!ratingRecord) {
      ratingRecord = await Rating.create({ bookingId });
    }

    if (ratingFrom === 'traveler') {
      ratingRecord.travelerRating = { rating, review, ratedAt: new Date() };
    } else {
      ratingRecord.ownerRating = { rating, review, ratedAt: new Date() };
    }

    await ratingRecord.save();
    res.status(201).json({ success: true, message: 'Rating submitted', ratingRecord });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBookingRatings = async (req, res, next) => {
  try {
    const rating = await Rating.findOne({ bookingId: req.params.bookingId });
    res.status(200).json({ success: true, rating });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};