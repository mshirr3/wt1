import  { Router } from 'express'
import { login, callback } from '../controllers/authController.js'

const router = Router()

router.get("/", (req, res) => {res.render('login')})

// login button to redirect to GitLab
router.get("/login", login)

// callback endpoint for GitLab
router.get("/callback", callback)

export default router
