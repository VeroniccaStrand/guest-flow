"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const visitRoutes_1 = __importDefault(require("./routes/visitRoutes"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const verifyToken_1 = require("./middleware/verifyToken");
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((0, cookie_parser_1.default)());
app.get('/api/check-auth', verifyToken_1.verifyToken, (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
});
// API Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/visits', visitRoutes_1.default);
// Static files
const uploadPath = path_1.default.join(__dirname, '../../uploads');
app.use('/uploads', express_1.default.static(uploadPath));
const viteDistPath = path_1.default.join(__dirname, '../../client/dist');
app.use(express_1.default.static(viteDistPath));
// Catch-all route for serving the React app
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(viteDistPath, 'index.html'));
});
// Error Handler Middleware
app.use(errorMiddleware_1.default);
// Create and configure the server
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: '*', // Allows connections from any domain
    },
});
// WebSocket connection handling
exports.io.on('connection', (socket) => {
    const clientAddress = socket.handshake.address;
    const connectTime = new Date().toISOString();
    console.log(`New client connected from ${clientAddress} at ${connectTime}`);
    console.log(clientAddress);
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
