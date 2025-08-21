import { Router } from 'express'
import { getProfile, getActivities } from '../controllers/gitlabController.js'

const router = Router()

router.get('/profile', getProfile)
router.get('/activities', getActivities)


export default router