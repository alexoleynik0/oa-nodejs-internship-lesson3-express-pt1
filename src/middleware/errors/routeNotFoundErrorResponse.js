// 404 Route response (must be very last as "route")
module.exports = (_req, res) => {
  res.status(404).json({
    message: 'Route Not Found.',
  });
};
