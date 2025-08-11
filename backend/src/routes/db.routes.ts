import express from 'express'
import { testAPI, getHelpers, addHelper, getHelperById, deleteHelperById, updateHelperById, uploadProfilePic, uploadProfilePicMiddleware, uploadKYCDoc, uploadKYCDocMiddleware } from '../controllers/db.controller.js';

const router = express.Router();


router.get("/test", testAPI)

router.get("/helpers", getHelpers)
router.get("/helpers/:_id", getHelperById)
router.post("/helpers", addHelper)
router.delete("/helpers/:_id", deleteHelperById)
router.put("/helpers/:_id", updateHelperById)

router.post("/upload-profile-pic", uploadProfilePicMiddleware, uploadProfilePic)
router.post("/upload-kyc-doc", uploadKYCDocMiddleware, uploadKYCDoc)

export default router