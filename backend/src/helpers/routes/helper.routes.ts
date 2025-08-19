import express from 'express'
import {
	getHelpers,
	addHelper,
	getHelperById,
	deleteHelperById,
	updateHelperById,
	getHelpersPaginated,
	downloadHelpers
} from "../controllers/db.controller.js"

const router = express.Router()

router.get("/", getHelpers)
router.get("/paginated", getHelpersPaginated)
router.get("/:_id", getHelperById)
router.post("/", addHelper)
router.put("/:_id", updateHelperById)
router.delete("/:_id", deleteHelperById)
router.get("/download", downloadHelpers)

export default router
