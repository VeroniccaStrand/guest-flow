import express from 'express';
import { protectVisit } from '../middleware/authMiddleware';
import { addVisit, deleteVisit, getAllVisits, updateVisit } from '../controllers/visitControllers';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.route('/')
  .post(protectVisit, upload.single('company_logo'), addVisit)
  .get(getAllVisits);

router.route('/:id')
  .put(protectVisit, upload.single('company_logo'), updateVisit)
  .delete(protectVisit, deleteVisit);

export default router;