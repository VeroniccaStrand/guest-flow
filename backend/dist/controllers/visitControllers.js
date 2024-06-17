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
const prisma = new client_1.PrismaClient();
// Helper function to close Prisma client
const closePrismaClient = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
});
// @desc    Add new Visit with details
// @route   POST /api/visits
// @access  Private
exports.addVisit = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('Request body:', req.body);
    const { company, company_info, visitor_count, visiting_departments, scheduled_arrival, host } = req.body;
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
    // Construct visitors array from the request body
    const visitors = [];
    for (let i = 0; i < 4; i++) {
        const visitorName = req.body[`visitors[${i}].name`];
        if (visitorName) {
            visitors.push({ name: visitorName });
        }
    }
    try {
        const newVisit = yield prisma.visit.create({
            data: {
                company,
                company_info,
                visitor_count,
                visiting_departments: Array.isArray(visiting_departments) ? visiting_departments.join(', ') : visiting_departments,
                scheduled_arrival: scheduledArrivalDate,
                isActive: scheduledArrivalDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0],
                host,
                createdById: userId,
            },
        });
        // Save visitors
        for (const visitor of visitors) {
            yield prisma.visitor.create({
                data: {
                    name: visitor.name,
                    visitId: newVisit.id,
                },
            });
        }
        // Fetch the new visit with its visitors to include in the socket emission
        const createdVisit = yield prisma.visit.findUnique({
            where: { id: newVisit.id },
            include: { visitors: true },
        });
        console.log('New visit created:', createdVisit);
        server_1.io.emit('newVisit', createdVisit);
        res.status(201).json(createdVisit);
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
    const { company, company_info, visitor_count, visiting_departments, scheduled_arrival, host, existingVisitors, newVisitors, deletedVisitors } = req.body;
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
            scheduled_arrival: new Date(scheduled_arrival),
            host,
        };
        // Overwrite existing visiting_departments if new ones are provided
        if (visiting_departments !== undefined) {
            updatedData.visiting_departments = visiting_departments;
            yield prisma.visit.update({
                where: { id: visitId },
                data: { visiting_departments: '' },
            });
        }
        // Update the visit with new data
        const updatedVisit = yield prisma.visit.update({
            where: { id: visitId },
            data: Object.assign(Object.assign({}, updatedData), { visiting_departments: visiting_departments !== undefined ? Array.isArray(visiting_departments) ? visiting_departments.join(', ') : visiting_departments : existingVisit.visiting_departments }),
        });
        // Handle visitor deletions
        if (deletedVisitors) {
            const deletedVisitorIds = JSON.parse(deletedVisitors);
            yield prisma.visitor.deleteMany({
                where: {
                    id: {
                        in: deletedVisitorIds,
                    },
                },
            });
        }
        // Update existing visitors
        if (existingVisitors) {
            const existingVisitorData = JSON.parse(existingVisitors);
            for (const visitor of existingVisitorData) {
                yield prisma.visitor.update({
                    where: { id: visitor.id },
                    data: { name: visitor.name },
                });
            }
        }
        // Add new visitors
        if (newVisitors) {
            const newVisitorData = JSON.parse(newVisitors);
            for (const visitor of newVisitorData) {
                yield prisma.visitor.create({
                    data: {
                        name: visitor.name,
                        visitId: updatedVisit.id,
                    },
                });
            }
        }
        // Fetch the updated visit with its visitors to include in the socket emission
        const updatedVisitWithVisitors = yield prisma.visit.findUnique({
            where: { id: visitId },
            include: { visitors: true },
        });
        console.log('Visit updated:', updatedVisitWithVisitors);
        server_1.io.emit('updateVisit', updatedVisitWithVisitors);
        res.status(200).json(updatedVisitWithVisitors);
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
    try {
        // Delete associated visitors
        yield prisma.visitor.deleteMany({
            where: { visitId },
        });
        // Delete the visit
        const deleteVisit = yield prisma.visit.delete({
            where: { id: visitId },
        });
        server_1.io.emit('deleteVisit', { id: visitId });
        res.json({ message: `Deleted visit ${deleteVisit.id} and its associated visitors` });
    }
    catch (error) {
        console.error('Error deleting visit and its visitors:', error);
        res.status(500).json({ message: 'An error occurred while deleting the visit and its visitors.', error });
    }
    finally {
        yield closePrismaClient();
    }
}));
// @desc    Get All visits
// @route   GET /api/visits
// @access  Public
// Convert buffer to base64
exports.getAllVisits = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const visits = yield prisma.visit.findMany({
        include: {
            visitors: true, // Include related visitors
        },
    });
    res.status(200).json(visits);
}));
