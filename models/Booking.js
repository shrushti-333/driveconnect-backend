const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  travelerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickupDateTime: { type: Date, required: true },
  estimatedReturnDateTime: { type: Date, required: true },
  actualReturnDateTime: Date,
  estimatedHours: Number,
  pricePerHour: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  commissionAmount: { type: Number },
  travelerIdType: String,
  travelerIdNumber: String,
  travelerIdDocument: String,
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paymentMethod: String,
  paymentVerifiedAt: Date,
  status: { type: String, enum: ['confirmed', 'ongoing', 'completed', 'cancelled'], default: 'confirmed' },
  cancellationReason: String,
  cancelledAt: Date,
  depositReturned: { type: Boolean, default: false },
  depositReturnedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);