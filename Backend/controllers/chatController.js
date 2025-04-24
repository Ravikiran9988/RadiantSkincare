const Chat = require('../models/Chat');
const Doctor = require('../models/Doctor');

exports.scheduleChat = async (req, res) => {
  const { userId, dateTime } = req.body;
  const doctor = await Doctor.findOne({ available: true });

  if (!doctor) return res.status(400).json({ message: "No doctor available" });

  const chat = new Chat({ userId, doctorId: doctor._id, scheduledTime: dateTime });
  await chat.save();

  res.status(201).json({ message: "Chat scheduled", chat });
};

exports.getUserChats = async (req, res) => {
  const chats = await Chat.find({ userId: req.params.userId }).populate("doctorId");
  res.json(chats);
};
