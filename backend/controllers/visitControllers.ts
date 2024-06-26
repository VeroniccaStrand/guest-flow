import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { io } from '../server';


const prisma = new PrismaClient();


// Helper function to close Prisma client
const closePrismaClient = async () => {
  await prisma.$disconnect();
};



// @desc    Add new Visit with details
// @route   POST /api/visits
// @access  Private
export const addVisit = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  console.log('Request body:', req.body);


  const { company,  hosting_company, scheduled_arrival, host, factoryTour } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    console.error('User ID is missing');
    res.status(400).json({ message: 'User ID is required' });
    return;
  }

    const scheduledArrivalDate = new Date(scheduled_arrival);
  scheduledArrivalDate.setUTCHours(0, 0, 0, 0); // Ensure time is set to midnight UTC

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
    const newVisit = await prisma.visit.create({
      data: {
        company,
        hosting_company,
        scheduled_arrival: scheduledArrivalDate,
        isActive: scheduledArrivalDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0],
        host,
        factoryTour: Boolean(factoryTour),
        createdById: userId,

        
      
        
      },
    });

    // Save visitors
    for (const visitor of visitors) {
      await prisma.visitor.create({
        data: {
          name: visitor.name,
          visitId: newVisit.id,
        },
      });
    }

    // Fetch the new visit with its visitors to include in the socket emission
    const createdVisit = await prisma.visit.findUnique({
      where: { id: newVisit.id },
      include: { visitors: true },
    });

    console.log('New visit created:', createdVisit);

    io.emit('newVisit', createdVisit);

    res.status(201).json(createdVisit);
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
  console.log('Request body:', req.body);

  const { 
    company, 
    factoryTour, 
    hosting_company, 
    scheduled_arrival, 
    host, 
    existingVisitors, 
    newVisitors, 
    deletedVisitors 
  } = req.body;

  try {
    const existingVisit = await prisma.visit.findUnique({
      where: { id: visitId },
    });

    if (!existingVisit) {
      console.error('Visit not found');
      res.status(404).json({ message: "Visit not found" });
      return;
    }
   const today = new Date().toISOString().split('T')[0];
    const isActive = scheduled_arrival === today;

    const updatedData: Record<string, any> = {
      company,
      factoryTour: factoryTour === 'true' || factoryTour === true, // Handle boolean and string values
      hosting_company,
      scheduled_arrival: new Date(scheduled_arrival),
      host,
      isActive,
    };

    // Update the visit with new data
    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: updatedData,
    });

    // Handle visitor deletions
    if (deletedVisitors) {
      const deletedVisitorIds = JSON.parse(deletedVisitors);
      await prisma.visitor.deleteMany({
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
        await prisma.visitor.update({
          where: { id: visitor.id },
          data: { name: visitor.name },
        });
      }
    }

    // Add new visitors
    if (newVisitors) {
      const newVisitorData = JSON.parse(newVisitors);
      for (const visitor of newVisitorData) {
        await prisma.visitor.create({
          data: {
            name: visitor.name,
            visitId: updatedVisit.id,
          },
        });
      }
    }

    // Fetch the updated visit with its visitors to include in the socket emission
    const updatedVisitWithVisitors = await prisma.visit.findUnique({
      where: { id: visitId },
      include: { visitors: true },
    });

    console.log('Visit updated:', updatedVisitWithVisitors);

    io.emit('updateVisit', updatedVisitWithVisitors);

    res.status(200).json(updatedVisitWithVisitors);
  } catch (error) {
    console.error('Error updating visit', error);
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

  try {
    // Delete associated visitors
    await prisma.visitor.deleteMany({
      where: { visitId },
    });

    // Delete the visit
    const deleteVisit = await prisma.visit.delete({
      where: { id: visitId },
    });

    io.emit('deleteVisit', { id: visitId });

    res.json({ message: `Deleted visit ${deleteVisit.id} and its associated visitors` });
  } catch (error) {
    console.error('Error deleting visit and its visitors:', error);
    res.status(500).json({ message: 'An error occurred while deleting the visit and its visitors.', error });
  } finally {
    await closePrismaClient();
  }
});

// @desc    Get All visits
// @route   GET /api/visits
// @access  Public



export const getAllVisits = asyncHandler(async (req: Request, res: Response) => {
  console.log('fetch backend')
  const visits = await prisma.visit.findMany({
    include: {
      visitors: true, // Include related visitors
    },
    
  });

 res.status(200).json(visits)



});