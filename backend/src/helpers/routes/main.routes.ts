import express from 'express'
import helperRouter from './helper.routes.js'
import uploadsRouter from './uploads.routes.js'

const router = express.Router();

router.use("/helpers", helperRouter)
router.use("/uploads", uploadsRouter)


export default router