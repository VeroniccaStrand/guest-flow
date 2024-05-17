import express from 'express'
import { Server } from 'socket.io';
import http from 'http';
import userRoutes from './routes/userRoutes'
import visitRoutes from './routes/visitRoutes'
import cookieParser from 'cookie-parser'
import errorHandler from './middleware/errorMiddleware';

import path from 'path';

const app = express();

const uploadPath = path.join(__dirname, '../../uploads');
app.use('../uploads', express.static(uploadPath));
app.use(cookieParser());
const server = http.createServer(app);



export const io = new Server(server, {
  cors: {
    origin: '*'  // Allows connections from any domain
  }
});

const port: number = parseInt(process.env.PORT as string, 10) || 3000;


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/users', userRoutes)
app.use('/api/visits', visitRoutes)

app.use(errorHandler)

io.on('connection', (socket) => {
  const clientAddress = socket.handshake.address;
  const connectTime = new Date().toISOString();
  console.log(`New client connected from ${clientAddress} at ${connectTime}`);

  socket.on('disconnect', () => {
    const disconnectTime = new Date().toISOString();
    console.log(`Client disconnected from ${clientAddress} at ${disconnectTime}`);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

