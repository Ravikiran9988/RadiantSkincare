// sockets/chatSocket.js
const Chat = require('../models/Chat');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 A user connected');

    socket.on('joinRoom', (userId) => {
      socket.join(userId);
      console.log(`✅ User joined room: ${userId}`);
    });

    socket.on('sendMessage', async ({ from, to, text }) => {
      console.log("📨 Incoming message:", { from, to, text });

      // Validate input
      if (!from || !to || !text) {
        console.warn("⚠️ Missing fields in chat message:", { from, to, text });
        return; // Skip saving and emitting
      }

      try {
        // Save message to DB
        const newMsg = new Chat({ from, to, text });
        await newMsg.save();

        // Emit to recipient (if connected)
        io.to(to).emit('receiveMessage', { from, text });
        console.log("✅ Message sent to:", to);
      } catch (error) {
        console.error("❌ Failed to save chat message:", error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 User disconnected');
    });
  });
};
