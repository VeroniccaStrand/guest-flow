"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = express_1.default.Router();
router.route('/').post(userController_1.registerUser).get(adminMiddleware_1.protect, userController_1.getAllUsers).delete(adminMiddleware_1.protect, userController_1.deleteUser).put(adminMiddleware_1.protect, userController_1.updateUserProfile);
router.route('/login').post(userController_1.loginUser);
router.route('/logout').post(userController_1.logoutUser);
exports.default = router;
