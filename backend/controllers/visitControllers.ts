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


export const addVisit = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { company, company_info, company_logo, visitor_count, visiting_departments, scheduled_arrival, isActive, welcome_message, host } = req.body;

  const userId = req.user?.id;
  if (!userId) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }

  console.log('Backend addVisit request body:', req.body);

  const scheduledArrivalDate = new Date(scheduled_arrival);
  if (isNaN(scheduledArrivalDate.getTime())) {
    res.status(400).json({ message: 'Invalid date format for scheduled_arrival' });
    return;
  }
  // Check if a visit already exists for the given company and time
  const visitExists = await prisma.visit.findMany({
    where: {
      company,
      scheduled_arrival: scheduledArrivalDate,
    },
  });

  if (visitExists.length > 0) {
    res.status(400).json({ message: 'Visit already scheduled for this company at the specified time.' });
    return;
  }

  try {
    // If no visit exists, create a new one
    const newVisit = await prisma.visit.create({
      data: {
        company,
        company_info,
        company_logo,
        visitor_count,
        visiting_departments,
        scheduled_arrival: scheduledArrivalDate,
        isActive,
        welcome_message,
        host,
        createdById: userId,
      },
    });

    

    // Emit the new visit to all connected clients
    io.emit('newVisit', newVisit);

    res.status(201).json(newVisit);
  } catch (error) {
    console.error('Error creating visit:', error);
    res.status(500).json({ message: 'An error occurred while creating the visit.', error });
  } finally {
    await prisma.$disconnect();
  }
});



// @desc    Update existing Visit
// @route   PUT /api/visits/:id
// @access  Private




export const updateVisit = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const visitId = req.params.id;
  console.log('Backend update visit - Visit ID:', visitId);

  try {
    // Retrieve the existing visit by ID
    const existingVisit = await prisma.visit.findUnique({
      where: { id: visitId },
    });

    if (!existingVisit) {
      console.log('Visit not found');
      res.status(404).json({ message: "Visit not found" });
      return;
    }

    console.log('Existing visit:', existingVisit);

    // Construct data object with only the fields you want to update
    let updatedData: Record<string, any> = {};

    for (const key in req.body) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updatedData[key] = req.body[key];
      }
    }

    // Convert visiting_departments to a string if it is an array
    if (Array.isArray(updatedData.visiting_departments)) {
      updatedData.visiting_departments = updatedData.visiting_departments.join(', ');
    }

    // Ensure scheduled_arrival is a valid ISO-8601 string
    if (updatedData.scheduled_arrival) {
      const date = new Date(updatedData.scheduled_arrival);
      if (!isNaN(date.getTime())) {
        updatedData.scheduled_arrival = date.toISOString();
      } else {
        console.error('Invalid scheduled_arrival format');
        res.status(400).json({ message: 'Invalid scheduled_arrival format' });
        return;
      }
    }

    // Update the visit with new data provided in the request body
    console.log('Updating visit with new data:', updatedData);
    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: updatedData,
    });

    console.log('Updated visit:', updatedVisit);

    // Emit the updated visit to all connected clients
    io.emit('updateVisit', updatedVisit);

    console.log('Visit updated successfully.');
    res.status(201).json(updatedVisit);
  } catch (error) {
    console.error('Error updating visit:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
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