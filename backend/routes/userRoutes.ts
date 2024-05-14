import express from 'express'
import { deleteUser, getAllUsers, loginUser, registerUser, updateUserProfile } from '../controllers/userController'
import { protect } from '../middleware/adminMiddleware'
const router = express.Router()
router.route('/').post(protect,registerUser).get(protect,getAllUsers).delete(protect,deleteUser).put(protect,updateUserProfile)
router.route('/login').post(loginUser)

export default router