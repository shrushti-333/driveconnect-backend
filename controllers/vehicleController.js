const Vehicle = require('../models/Vehicle');

exports.registerVehicle = async (req, res, next) => {
  try {
    const { make, model, year, registrationNumber, mileage, fuelType, pricePerHour, securityDeposit, city, address, latitude, longitude, insuranceNumber, insuranceDocuments, insuranceValidTill, photos, features, description, availableFrom } = req.body;

    let vehicle = await Vehicle.findOne({ registrationNumber });
    if (vehicle) {
      return res.status(400).json({ success: false, message: 'Vehicle already registered' });
    }

    vehicle = await Vehicle.create({
      ownerId: req.user.id,
      make, model, year, registrationNumber, mileage, fuelType, pricePerHour, securityDeposit,
      insuranceNumber, insuranceDocuments, insuranceValidTill, photos, features, description, availableFrom,
      location: { city, address, coordinates: { type: 'Point', coordinates: [longitude, latitude] } }
    });

    res.status(201).json({ success: true, message: 'Vehicle registered', vehicle });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getVehicles = async (req, res, next) => {
  try {
    const { city, minPrice, maxPrice } = req.query;

    let query = {};
    if (city) query['location.city'] = city;
    if (minPrice || maxPrice) {
      query.pricePerHour = {};
      if (minPrice) query.pricePerHour.$gte = minPrice;
      if (maxPrice) query.pricePerHour.$lte = maxPrice;
    }

    const vehicles = await Vehicle.find(query);
    res.status(200).json({ success: true, count: vehicles.length, vehicles });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('ownerId', 'name averageRating');
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.status(200).json({ success: true, vehicle });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (vehicle.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, vehicle });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Vehicle deleted' });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};