const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, userType, govtIdType, govtIdNumber, govtIdDocument } = req.body;

    let user = await User.findOne({ $or: [{ email }, { phone }] });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email or phone already exists' });
    }

    user = await User.create({
      name, email, phone, password, userType, govtIdType, govtIdNumber, govtIdDocument
    });

    const token = generateToken(user._id, user.userType);

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, userType: user.userType }
    });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.userType);

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, userType: user.userType }
    });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};