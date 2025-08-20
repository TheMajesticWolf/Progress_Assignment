import express from 'express'
import {
	getHelpers,
	addHelper,
	getHelperById,
	deleteHelperById,
	updateHelperById,
	getHelpersPaginated,
	downloadHelpers,
	helperUploadMiddleware
} from "../controllers/db.controller.js"
import { asyncHandler } from '../middleware/asyncHandler.middleware.js'

const router = express.Router()

router.get("/", asyncHandler(getHelpers))
router.get("/paginated", asyncHandler(getHelpersPaginated))
router.get("/download", asyncHandler(downloadHelpers))
router.post("/", helperUploadMiddleware, asyncHandler(addHelper))
router.put("/:_id", helperUploadMiddleware, asyncHandler(updateHelperById))
router.delete("/:_id", asyncHandler(deleteHelperById))
router.get("/:_id", asyncHandler(getHelperById))

export default router
