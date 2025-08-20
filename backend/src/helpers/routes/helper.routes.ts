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

const router = express.Router()

router.get("/", getHelpers)
router.get("/paginated", getHelpersPaginated)
router.get("/download", downloadHelpers)
router.post("/", helperUploadMiddleware, addHelper)
router.put("/:_id", updateHelperById)
router.delete("/:_id", deleteHelperById)
router.get("/:_id", getHelperById)

export default router
