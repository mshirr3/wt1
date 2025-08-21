import { Router } from 'express'
import { getProfile } from '../controllers/gitlabController.js'

const router = Router()

router.get('/profile', getProfile)

export default router