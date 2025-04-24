import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Replace with your backend socket URL in production

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // so you can control when to connect
});

export default socket;
