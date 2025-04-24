const Doctor = require('../models/Doctor');

exports.getAvailableDoctors = async (req, res) => {
  const doctors = await Doctor.find({ available: true });
  res.json(doctors);
};
