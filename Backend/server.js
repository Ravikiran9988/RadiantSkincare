const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const socketIO = require('socket.io');
require('dotenv').config();

// ✅ Route files
const dashboardRoutes = require('./routes/dashboardRoutes');
const submissionRoutes = require('./routes/submission');
const authRoutes = require('./routes/auth');
const consultationRoutes = require('./routes/consultation');
const chatRoutes = require('./routes/chat');
const doctorAuthRoutes = require('./routes/doctorAuth');
const doctorRoutes = require('./routes/doctor'); // <-- Make sure this file exists and is implemented

// ✅ Express app & HTTP server
const app = express();
const server = http.createServer(app);

// ✅ Socket.IO setup
const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:5173'], // Replace with frontend URL when deploying
    credentials: true,
  },
});

// ✅ Port
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ DB connection error:', err));

// ✅ Routes
app.use('/api', dashboardRoutes);
app.use('/api', submissionRoutes);
app.use('/api', authRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/doctor', doctorAuthRoutes);  // For doctor login/register
app.use('/api/doctor', doctorRoutes);      // For doctor profile and consultations

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('🌟 Radiant Skincare API is running');
});

// ✅ 404 for unknown API routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'API route not found' });
});

// ✅ Socket.IO events
require('./sockets/chatSocket')(io);

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
