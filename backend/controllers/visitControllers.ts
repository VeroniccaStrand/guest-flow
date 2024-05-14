import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { io } from '../server'; // Import the io instance

const prisma = new PrismaClient();

// Helper function to close Prisma client
const closePrismaClient = async () => {
  await prisma.$disconnect();
};

// @desc    Add new Visit with details
// @route   POST /api/visits
// @access  Private
export const addVisit = asyncHandler(async (req: Request, res: Response) => {
  const { company, company_info, company_logo, visitor_count, visiting_departments, scheduled_arrival, isActive, welcome_message, host } = req.body;

  // Check if a visit already exists for the given company and time
  const visitExists = await prisma.visit.findMany({
    where: {
      company,
      scheduled_arrival,
    },
  });

  if (visitExists.length > 0) {
    res.status(400).json({ message: 'Visit already scheduled for this company at the specified time.' });
    await closePrismaClient(); // Close Prisma client
    return; // Important to stop further execution
  }

  // If no visit exists, create a new one
  const newVisit = await prisma.visit.create({
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
      createdById: req.user!.id, // Use the user ID from the request
    },
  });

  // Emit the new visit to all connected clients
  io.emit('newVisit', newVisit);

  res.status(201).json(newVisit); // Return the newly created visit
  await closePrismaClient(); // Close Prisma client
});

// @desc    Update existing Visit
// @route   PUT /api/visits/:id
// @access  Private
export const updateVisit = asyncHandler(async (req: Request, res: Response) => {
  const visitId = req.params.id;

  // Retrieve the existing visit by ID
  const existingVisit = await prisma.visit.findUnique({
    where: { id: visitId },
  });

  if (!existingVisit) {
    res.status(404).json({ message: "Visit not found" });
    await closePrismaClient(); // Close Prisma client
    return;
  }

  // Update the visit with new data provided in the request body
  const updatedVisit = await prisma.visit.update({
    where: { id: visitId },
    data: {
      ...req.body
    },
  });

  // Emit the updated visit to all connected clients
  io.emit('updateVisit', updatedVisit);

  res.json(updatedVisit);
  await closePrismaClient(); // Close Prisma client
});

// @desc    Delete visit
// @route   DELETE /api/visits/:id
// @access  Private
export const deleteVisit = asyncHandler(async (req: Request, res: Response) => {
  const visitId = req.params.id;

  const deleteVisit = await prisma.visit.delete({
    where: { id: visitId }
  });

  // Emit the deletion to all connected clients
  io.emit('deleteVisit', { id: visitId });

  res.json({ message: `deleted visit ${deleteVisit.id}` });
  await closePrismaClient(); // Close Prisma client
});

// @desc    Get All visits
// @route   GET /api/visits
// @access  public

export const getAllVisits = asyncHandler(async (req: Request, res: Response) => {
  // Retrieve all users from the database
  const visits = await prisma.visit.findMany();

  // Send the list of users as the response
  res.status(200).json(visits);
});