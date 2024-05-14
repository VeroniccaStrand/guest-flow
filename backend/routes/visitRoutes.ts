import express from 'express'
import { protectVisit } from '../middleware/authMiddleware'
import { addVisit, deleteVisit, getAllVisits, updateVisit } from '../controllers/visitControllers'


const router = express.Router()
router.route('/').post(protectVisit, addVisit).get(getAllVisits)
router.route('/:id').put(protectVisit,updateVisit).delete(protectVisit,deleteVisit)

export default router