import express from 'express'
import { loginUser, registerUser } from '../controllers/userController'
import { protect } from '../middleware/authMiddleware'
const router = express.Router()
router.route('/').post(protect,registerUser)
router.route('/login').post(loginUser)

export default router