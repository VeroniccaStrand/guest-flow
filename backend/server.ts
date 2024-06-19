import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes';
import visitRoutes from './routes/visitRoutes';
import errorHandler from './middleware/errorMiddleware';
import { verifyToken } from './middleware/verifyToken';
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.get('/api/check-auth', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Authenticated' });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/visits', visitRoutes);

// Static files
const uploadPath = path.join(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadPath));

const viteDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(viteDistPath));

// Catch-all route for serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(viteDistPath, 'index.html'));
});

// Error Handler Middleware
app.use(errorHandler);

// Create and configure the server
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: '*',  // Allows connections from any domain
  },
});

// WebSocket connection handling

io.on('connection', (socket) => {
  const clientAddress = socket.handshake.address;
  const connectTime = new Date().toISOString();
  console.log(`New client connected from ${clientAddress} at ${connectTime}`);
 console.log(clientAddress)
  socket.on('disconnect', () => {
    const disconnectTime = new Date().toISOString();
    console.log(`Client disconnected from ${clientAddress} at ${disconnectTime}`);
  });
});
// Start the server
const port = parseInt(process.env.PORT || '3000', 10);
server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port: ${port}`);
});
