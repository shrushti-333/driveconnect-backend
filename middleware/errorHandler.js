const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: 'Duplicate entry' });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
};

module.exports = errorHandler;