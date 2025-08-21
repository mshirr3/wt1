import { Router } from 'express'
import { getProfile, getActivities, getLimitedGroupsAndProjects  } from '../controllers/gitlabController.js'

const router = Router()

router.get('/profile', getProfile)
router.get('/activities', getActivities)
router.get('/groups', getLimitedGroupsAndProjects )

export default router