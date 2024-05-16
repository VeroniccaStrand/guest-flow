"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const visitRoutes_1 = __importDefault(require("./routes/visitRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: '*' // Allows connections from any domain
    }
});
const port = parseInt(process.env.PORT, 10) || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/api/users', userRoutes_1.default);
app.use('/api/visits', visitRoutes_1.default);
app.use(errorMiddleware_1.default);
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
