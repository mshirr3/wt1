import express from 'express'
import session from 'express-session'
import router from './routes/authRoutes.js'
import dotenv from 'dotenv'
import logger from 'morgan'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config()

const app = express()

// session to keep tokens later
app.use(session({
  secret: "veryyy-secret",
  resave: false,
  saveUninitialized: true
}))

// Get the directory name of this module's path.
const directoryFullName = dirname(fileURLToPath(import.meta.url))

// Set the base URL to use for all relative URLs in a document.
const baseURL = process.env.BASE_URL || '/'

// Set up a morgan logger using the dev format for log entries.
app.use(logger('dev'))

// View engine setup.
app.set('view engine', 'ejs')
app.set('views', join(directoryFullName, 'views'))


// routes
app.use("/", router)

app.listen(3000, () => {
  console.log("App running at http://localhost:3000")
})
