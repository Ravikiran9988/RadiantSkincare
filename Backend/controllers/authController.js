const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ message: "Registration error", error: err.message });
  }
};
