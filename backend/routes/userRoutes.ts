import express from 'express'
import { deleteUser, getAllUsers, loginUser, logoutUser, registerUser, updateUserProfile } from '../controllers/userController'
import { protect } from '../middleware/adminMiddleware'
const router = express.Router()
router.route('/').post(registerUser).get(protect,getAllUsers).delete(protect,deleteUser).put(protect,updateUserProfile)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
export default router