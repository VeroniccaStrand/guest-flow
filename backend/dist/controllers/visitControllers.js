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
const server_1 = require("../server"); // Import the io instance
const prisma = new client_1.PrismaClient();
// Helper function to close Prisma client
const closePrismaClient = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
});
// @desc    Add new Visit with details
// @route   POST /api/visits
// @access  Private
exports.addVisit = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { company, company_info, company_logo, visitor_count, visiting_departments, scheduled_arrival, isActive, welcome_message, host } = req.body;
    // Check if a visit already exists for the given company and time
    const visitExists = yield prisma.visit.findMany({
        where: {
            company,
            scheduled_arrival,
        },
    });
    if (visitExists.length > 0) {
        res.status(400).json({ message: 'Visit already scheduled for this company at the specified time.' });
        yield closePrismaClient(); // Close Prisma client
        return; // Important to stop further execution
    }
    // If no visit exists, create a new one
    const newVisit = yield prisma.visit.create({
        data: {
            company,
            company_info,
            company_logo,
            visitor_count,
            visiting_departments,
            scheduled_arrival,
            isActive,
            welcome_message,
            host,
            createdById: req.user.id, // Use the user ID from the request
        },
    });
    // Emit the new visit to all connected clients
    server_1.io.emit('newVisit', newVisit);
    res.status(201).json(newVisit); // Return the newly created visit
    yield closePrismaClient(); // Close Prisma client
}));
// @desc    Update existing Visit
// @route   PUT /api/visits/:id
// @access  Private
exports.updateVisit = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const visitId = req.params.id;
    // Retrieve the existing visit by ID
    const existingVisit = yield prisma.visit.findUnique({
        where: { id: visitId },
    });
    if (!existingVisit) {
        res.status(404).json({ message: "Visit not found" });
        yield closePrismaClient(); // Close Prisma client
        return;
    }
    // Update the visit with new data provided in the request body
    const updatedVisit = yield prisma.visit.update({
        where: { id: visitId },
        data: Object.assign({}, req.body),
    });
    // Emit the updated visit to all connected clients
    server_1.io.emit('updateVisit', updatedVisit);
    res.json(updatedVisit);
    yield closePrismaClient(); // Close Prisma client
}));
// @desc    Delete visit
// @route   DELETE /api/visits/:id
// @access  Private
exports.deleteVisit = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const visitId = req.params.id;
    const deleteVisit = yield prisma.visit.delete({
        where: { id: visitId }
    });
    // Emit the deletion to all connected clients
    server_1.io.emit('deleteVisit', { id: visitId });
    res.json({ message: `deleted visit ${deleteVisit.id}` });
    yield closePrismaClient(); // Close Prisma client
}));
// @desc    Get All visits
// @route   GET /api/visits
// @access  public
exports.getAllVisits = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve all users from the database
    const visits = yield prisma.visit.findMany();
    // Send the list of users as the response
    res.status(200).json(visits);
}));
