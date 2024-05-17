import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { io } from '../server';
import multer from 'multer';
import fs from 'fs';

const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to close Prisma client
const closePrismaClient = async () => {
  await prisma.$disconnect();
};



// Helper function to convert base64 to buffer
// Helper function to convert file to base64 string
const convertFileToBase64 = (filePath: string) => {
  const fileBuffer = fs.readFileSync(filePath);
  return fileBuffer.toString('base64');
};

// Helper function to convert base64 to Buffer
const base64ToBuffer = (base64: string): Buffer => {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
};

// @desc    Add new Visit with details
// @route   POST /api/visits
// @access  Private
export const addVisit = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  const { company, company_info, visitor_count, visiting_departments, scheduled_arrival, welcome_message, host } = req.body;
  const company_logo = req.file ? req.file.path : null;
  console.log('Company logo path:', company_logo);

  const userId = req.user?.id;
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

  let companyLogoBuffer: Buffer | null = null;
  if (company_logo) {
    try {
      companyLogoBuffer = base64ToBuffer(company_logo);
    } catch (error) {
      console.error('Error converting base64 to buffer:', error);
      res.status(400).json({ message: 'Invalid image data' });
      return;
    }
  }

  try {
    const newVisit = await prisma.visit.create({
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
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  const { company, company_info, visitor_count, visiting_departments, scheduled_arrival, welcome_message, host } = req.body;
  let company_logo = req.file ? req.file.path : null;

  if (req.file) {
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    company_logo = fileBuffer.toString('base64'); // Convert Buffer to base64 string
  } else if (company_logo && company_logo.startsWith('data:image/')) {
    company_logo = base64ToBuffer(company_logo).toString('base64');
  }

  try {
    const existingVisit = await prisma.visit.findUnique({
      where: { id: visitId },
    });

    if (!existingVisit) {
      console.error('Visit not found');
      res.status(404).json({ message: "Visit not found" });
      return;
    }

    const updatedData: Record<string, any> = {
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

    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: updatedData,
    });
    console.log('Visit updated:', updatedVisit);

    io.emit('updateVisit', updatedVisit);

    res.status(201).json(updatedVisit);
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

  const deleteVisit = await prisma.visit.delete({
    where: { id: visitId }
  });

  io.emit('deleteVisit', { id: visitId });

  res.json({ message: `deleted visit ${deleteVisit.id}` });
  await closePrismaClient();
});


// @desc    Get All visits
// @route   GET /api/visits
// @access  Public
// Convert buffer to base64
const bufferToBase64 = (buffer: Buffer): string => {
  return buffer.toString('base64');
};

export const getAllVisits = asyncHandler(async (req: Request, res: Response) => {
  const visits = await prisma.visit.findMany();

  // Convert buffer to base64 string for all visits
  const visitsWithBase64Logo = visits.map(visit => ({
    ...visit,
    company_logo: visit.company_logo ? bufferToBase64(visit.company_logo) : null,
  }));

  res.status(200).json(visitsWithBase64Logo);
});
