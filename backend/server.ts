import express from 'express'
import { Server } from 'socket.io';
import http from 'http';
import userRoutes from './routes/userRoutes'
import visitRoutes from './routes/visitRoutes'
import cookieParser from 'cookie-parser'
import errorHandler from './middleware/errorMiddleware';
const app = express();
const server = http.createServer(app);
app.use(cookieParser());
export const io = new Server(server, {
  cors: {
    origin: '*'  // Allows connections from any domain
  }
});

const port: number = parseInt(process.env.PORT as string, 10) || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRoutes)
app.use('/api/visits', visitRoutes)

app.use(errorHandler)
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

