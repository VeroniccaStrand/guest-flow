"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVisits = exports.deleteVisit = exports.updateVisit = exports.addVisit = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const client_1 = require("@prisma/client");
const server_1 = require("../server");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Helper function to close Prisma client
const closePrismaClient = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
});
// Helper function to convert base64 to buffer
// Helper function to convert file to base64 string
const convertFileToBase64 = (filePath) => {
    const fileBuffer = fs_1.default.readFileSync(filePath);
    return fileBuffer.toString('base64');
};
// Helper function to convert base64 to Buffer
const base64ToBuffer = (base64) => {
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
};
// @desc    Add new Visit with details
// @route   POST /api/visits
// @access  Private
exports.addVisit = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    const { company, company_info, visitor_count, visiting_departments, scheduled_arrival, welcome_message, host } = req.body;
    const company_logo = req.file ? req.file.path : null;
    console.log('Company logo path:', company_logo);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        console.error('User ID is missing');
        res.status(400).json({ message: 'User ID is required' });
        return;
    }
    const scheduledArrivalDate = new Date(scheduled_arrival);
    if (isNaN(scheduledArrivalDate.getTime())) {
        console.error('Invalid date format for scheduled_arrival');
        res.status(400).json({ message: 'Invalid date format for scheduled_arrival' });
        return;
    }
    let companyLogoBuffer = null;
    if (company_logo) {
        try {
            companyLogoBuffer = base64ToBuffer(company_logo);
        }
        catch (error) {
            console.error('Error converting base64 to buffer:', error);
            res.status(400).json({ message: 'Invalid image data' });
            return;
        }
    }
    try {
        const newVisit = yield prisma.visit.create({
            data: {
                company,
                company_info,
                company_logo: companyLogoBuffer,
                visitor_count,
                visiting_departments: Array.isArray(visiting_departments) ? visiting_departments.join(', ') : visiting_departments,
                scheduled_arrival: scheduledArrivalDate,
                isActive: scheduledArrivalDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0],
                welcome_message,
                host,
                createdById: userId,
            },
        });
        console.log('New visit created:', newVisit);
        server_1.io.emit('newVisit', newVisit);
        res.status(201).json(newVisit);
    }
    catch (error) {
        console.error('Error creating visit:', error);
        res.status(500).json({ message: 'An error occurred while creating the visit.', error });
    }
    finally {
        yield prisma.$disconnect();
    }
}));
// @desc    Update existing Visit
// @route   PUT /api/visits/:id
// @access  Private
exports.updateVisit = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const visitId = req.params.id;
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    const { company, company_info, visitor_count, visiting_departments, scheduled_arrival, welcome_message, host } = req.body;
    let company_logo = req.file ? req.file.path : null;
    if (req.file) {
        const filePath = req.file.path;
        const fileBuffer = fs_1.default.readFileSync(filePath);
        company_logo = fileBuffer.toString('base64'); // Convert Buffer to base64 string
    }
    else if (company_logo && company_logo.startsWith('data:image/')) {
        company_logo = base64ToBuffer(company_logo).toString('base64');
    }
    try {
        const existingVisit = yield prisma.visit.findUnique({
            where: { id: visitId },
        });
        if (!existingVisit) {
            console.error('Visit not found');
            res.status(404).json({ message: "Visit not found" });
            return;
        }
        const updatedData = {
            company,
            company_info,
            visitor_count,
            visiting_departments: Array.isArray(visiting_departments) ? visiting_departments.join(', ') : visiting_departments,
            scheduled_arrival: new Date(scheduled_arrival),
            welcome_message,
            host,
        };
        if (company_logo) {
            updatedData.company_logo = company_logo;
        }
        const updatedVisit = yield prisma.visit.update({
            where: { id: visitId },
            data: updatedData,
        });
        console.log('Visit updated:', updatedVisit);
        server_1.io.emit('updateVisit', updatedVisit);
        res.status(201).json(updatedVisit);
    }
    catch (error) {
        console.error('Error updating visit', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    finally {
        yield prisma.$disconnect();
    }
}));
// @desc    Delete visit
// @route   DELETE /api/visits/:id
// @access  Private
exports.deleteVisit = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const visitId = req.params.id;
    const deleteVisit = yield prisma.visit.delete({
        where: { id: visitId }
    });
    server_1.io.emit('deleteVisit', { id: visitId });
    res.json({ message: `deleted visit ${deleteVisit.id}` });
    yield closePrismaClient();
}));
// @desc    Get All visits
// @route   GET /api/visits
// @access  Public
// Convert buffer to base64
const bufferToBase64 = (buffer) => {
    return buffer.toString('base64');
};
exports.getAllVisits = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const visits = yield prisma.visit.findMany();
    // Convert buffer to base64 string for all visits
    const visitsWithBase64Logo = visits.map(visit => (Object.assign(Object.assign({}, visit), { company_logo: visit.company_logo ? bufferToBase64(visit.company_logo) : null })));
    res.status(200).json(visitsWithBase64Logo);
}));
