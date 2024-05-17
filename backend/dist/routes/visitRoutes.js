"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const visitControllers_1 = require("../controllers/visitControllers");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const router = express_1.default.Router();
router.route('/')
    .post(authMiddleware_1.protectVisit, uploadMiddleware_1.default.single('company_logo'), visitControllers_1.addVisit)
    .get(visitControllers_1.getAllVisits);
router.route('/:id')
    .put(authMiddleware_1.protectVisit, uploadMiddleware_1.default.single('company_logo'), visitControllers_1.updateVisit)
    .delete(authMiddleware_1.protectVisit, visitControllers_1.deleteVisit);
exports.default = router;
