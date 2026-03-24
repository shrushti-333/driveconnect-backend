const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

exports.createBooking = async (req, res, next) => {
  try {
    const { vehicleId, pickupDateTime, estimatedReturnDateTime, travelerIdType, travelerIdNumber, travelerIdDocument } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const pickup = new Date(pickupDateTime);
    const returnDate = new Date(estimatedReturnDateTime);
    const hours = Math.ceil((returnDate - pickup) / (1000 * 60 * 60));

    const booking = new Booking({
      vehicleId,
      travelerId: req.user.id,
      ownerId: vehicle.ownerId,
      pickupDateTime: pickup,
      estimatedReturnDateTime: returnDate,
      estimatedHours: hours,
      pricePerHour: vehicle.pricePerHour,
      totalAmount: hours * vehicle.pricePerHour,
      commissionAmount: Math.round(hours * vehicle.pricePerHour * 0.10),
      securityDeposit: vehicle.securityDeposit,
      travelerIdType, travelerIdNumber, travelerIdDocument
    });

    await booking.save();
    res.status(201).json({ success: true, message: 'Booking created', booking });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      $or: [{ travelerId: req.user.id }, { ownerId: req.user.id }]
    }).populate('vehicleId').populate('travelerId').populate('ownerId');

    res.status(200).json({ success: true, bookings });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('vehicleId').populate('travelerId').populate('ownerId');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.travelerId._id.toString() !== req.user.id && booking.ownerId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, booking });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.confirmPayment = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (booking.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    booking.paymentStatus = 'paid';
    booking.paymentVerifiedAt = new Date();
    booking.status = 'completed';
    await booking.save();

    res.status(200).json({ success: true, message: 'Payment confirmed', booking });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (booking.travelerId.toString() !== req.user.id && booking.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking cancelled', booking });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};