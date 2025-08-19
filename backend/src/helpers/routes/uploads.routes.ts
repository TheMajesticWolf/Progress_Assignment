import express from 'express'
import { uploadProfilePicMiddleware, uploadProfilePic, uploadKYCDocMiddleware, uploadKYCDoc, uploadAdditionalDocMiddleware, uploadAdditionalDoc } from '../controllers/db.controller.js'

const router = express.Router()

router.post("/upload-profile-pic", uploadProfilePicMiddleware, uploadProfilePic)
router.post("/upload-kyc-doc", uploadKYCDocMiddleware, uploadKYCDoc)
router.post("/upload-additional-doc", uploadAdditionalDocMiddleware, uploadAdditionalDoc)


export default router