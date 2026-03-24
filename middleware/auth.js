const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, userType: decoded.userType };
    next();
  } catch(err) {
    return res.status(401).json({ success: false, message: 'Token invalid' });
  }
};

exports.isOwner = (req, res, next) => {
  if (req.user.userType !== 'owner') {
    return res.status(403).json({ success: false, message: 'Owners only' });
  }
  next();
};

exports.isTraveler = (req, res, next) => {
  if (req.user.userType !== 'traveler') {
    return res.status(403).json({ success: false, message: 'Travelers only' });
  }
  next();
};