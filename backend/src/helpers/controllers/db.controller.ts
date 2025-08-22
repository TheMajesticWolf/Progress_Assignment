import type { NextFunction, Request, Response } from "express"
import HelperModel from "../models/Helper.model.js"
import type { Helper, KYCDetails } from "../interfaces/helper.interface.js"
import multer from 'multer'
import path from "path"
import fs from 'fs'
import { Parser } from 'json2csv'
import type { SortOrder } from "mongoose"
import type { APIResponse } from "../interfaces/response.interface.js"

const uploadsPath = path.resolve('./uploads');
const profilePicsPath = path.join(uploadsPath, 'profile-pics');
const kycDocsPath = path.join(uploadsPath, 'kyc-docs');
const additionalDocsPath = path.join(uploadsPath, 'additional-docs');

[uploadsPath, profilePicsPath, kycDocsPath, additionalDocsPath].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
});


const storageProfilePics = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads/profile-pics');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});


const storageKyc = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads/kyc-docs');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const storageAdditionalDoc = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads/additional-docs');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const uploadProfilePics = multer({
	storage: storageProfilePics,
})

const uploadKyc = multer({
	storage: storageKyc,
})

const uploadAdditional = multer({
	storage: storageAdditionalDoc
})


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (file.fieldname === "profilePic") cb(null, "uploads/profile-pics/");
		else if (file.fieldname === "kycDoc") cb(null, "uploads/kyc-docs/");
		else if (file.fieldname === "additionalDoc") cb(null, "uploads/additional-docs/");
		else cb(null, "uploads/others/");
	},
	filename: (req, file, cb) => {
		const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
		cb(null, uniqueName);
	},
});

const upload = multer({ storage }); 

export const helperUploadMiddleware = upload.fields([
	{ name: 'profilePic', maxCount: 1 },
	{ name: 'kycDoc', maxCount: 1 },
	{ name: 'additionalDoc', maxCount: 1 }
])

export let testAPI = (req: Request, res: Response, next: NextFunction) => {
	res.send("HEewwfwllo world")
}

export let getHelpers = async (req: Request, res: Response, next: NextFunction) => {
	
	// try {
		
		let data = await HelperModel.find({})
		res.status(200).json({success: true, data} as APIResponse)
		
	// }

	// catch(err) {
		// res.status(500).json({success: false, error: (err as Error).message} as APIResponse)
	// }

	
}

export let addHelper = async (req: Request, res: Response, next: NextFunction) => {

	let userData: Helper = req.body;

	let h: Helper = userData as Helper

		const files = req.files as {
			[key: string]: Express.Multer.File[]
		}

		console.log(req.files)

		// Extract form fields
		const {
			fullName,
			organisationName,
			phone,
			email,
			gender,
			typeOfService,
			vehicleType,
			vehicleNumber,
			kycDetails,
			languages
		} = req.body

		// console.log(req.body)

		let parsedKycDetails: { documentType: DocumentType; document: string };
		
			const parsed = JSON.parse(kycDetails);
			parsedKycDetails = {
				documentType: parsed.documentType,
				document: files?.["kycDoc"]?.[0]
					? `/uploads/kyc-docs/${files["kycDoc"][0].filename}`
					: ""
			};
		
			
		


		// Construct full helper object
		const helper = {
			fullName,
			organisationName,
			phone,
			email,
			gender,
			typeOfService,
			vehicleType,
			vehicleNumber,
			languages: Array.isArray(languages) ? languages : [languages],
			photoUrl: files?.['profilePic']?.[0] ? `/uploads/profile-pics/${files['profilePic'][0].filename}` : "",
			additionalDocs: files?.['additionalDoc']?.[0] ? `/uploads/additional-docs/${files['additionalDoc'][0].filename}` : "",
			kycDetails: parsedKycDetails
		}

		console.log(helper)
		console.log("*************************************************************")

		
		let data = await new HelperModel(helper).save()
		// await HelperModel.findByIdAndDelete(data.id)
		res.status(201).json({success: true, data} as APIResponse)
		
	

	
}

export let getHelperById = async (req: Request, res: Response, next: NextFunction) => {
	
	let _id = req.params["_id"]
	
	// try {
		
		let data = await HelperModel.findById(_id, {}, {})

		if(data) {
			return res.status(200).json({success: true, data} as APIResponse)
		}
		
		res.status(404).json({success: true, error: "Helper does not exist"} as APIResponse)
		
	// }
	
	// catch(err) {
		// res.status(500).json({success: false, error: (err as Error).message} as APIResponse)
	// }
	
	
	
}


export let deleteHelperById = async (req: Request, res: Response, next: NextFunction) => {
	
	let _id = req.params["_id"]
	
	// try {
		
		let data = await HelperModel.findByIdAndDelete(_id, {})
		
		if(data) {
			return res.status(200).json({success: true, data} as APIResponse)
		}
		res.status(404).json({success: true, error: "Helper does not exist for deletion"} as APIResponse)
		
	// }
	
	// catch(err) {
		// res.status(500).json({success: false, error: (err as Error).message} as APIResponse)
	// }
	
	
	
}


export let updateHelperById = async (req: Request, res: Response, next: NextFunction) => {
	let _id = req.params["_id"]

	console.log("========================================================")
	console.log(req.body)
	console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
	console.log(req.files)
	console.log("========================================================")
	
	let existingHelper = await HelperModel.findById(_id)

	if (!existingHelper) {
		return res.status(404).json({ success: false, error: "Helper does not exist for update" })
	}

	let files = req.files as {
		[key: string]: Express.Multer.File[]
	}

	let parsedKycDetails: { documentType: string; document: string } = {
		documentType: "",
		document: ""
	};

	if (req.body.kycDetails) {
		const parsed = JSON.parse(req.body.kycDetails)
		parsedKycDetails.documentType = parsed.documentType
		parsedKycDetails.document =
			files?.["kycDoc"]?.[0]
				? `/uploads/kyc-docs/${files["kycDoc"][0].filename}`
				: existingHelper.kycDetails.document 
	}

	
	const updatedHelper: Partial<Helper> = {
		fullName: req.body.fullName || existingHelper.fullName,
		organisationName: req.body.organisationName || existingHelper.organisationName,
		phone: req.body.phone || existingHelper.phone,
		email: req.body.email || existingHelper.email,
		gender: req.body.gender || existingHelper.gender,
		typeOfService: req.body.typeOfService || existingHelper.typeOfService,
		vehicleType: req.body.vehicleType || existingHelper.vehicleType,
		vehicleNumber: req.body.vehicleNumber || existingHelper.vehicleNumber,
		languages: req.body.languages || existingHelper.languages,
		photoUrl: files?.["profilePic"]?.[0]
			? `/uploads/profile-pics/${files["profilePic"][0].filename}`
			: existingHelper.photoUrl,
		additionalDocs: files?.["additionalDoc"]?.[0]
			? `/uploads/additional-docs/${files["additionalDoc"][0].filename}`
			: existingHelper.additionalDocs,
		kycDetails: parsedKycDetails as KYCDetails || existingHelper.kycDetails as KYCDetails
	}

	
	const data = await HelperModel.findByIdAndUpdate(_id, updatedHelper, { new: true })

	res.status(200).json({ success: true, data })
	
}


export let uploadProfilePic = async (req: Request, res: Response, next: NextFunction) => {

	let file = req.file
	
	console.log(req)
	if(file) {
		res.status(200).json({success: true, data: `/uploads/profile-pics/${file.filename}`} as APIResponse)
	}

}

export let uploadProfilePicMiddleware = uploadProfilePics.single('profilePic');




export let uploadKYCDoc = async (req: Request, res: Response, next: NextFunction) => {

	let file = req.file
	
	console.log(req)
	if(file) {
		res.status(200).json({success: true, data: `/uploads/kyc-docs/${file.filename}`} as APIResponse)
	}

}

export let uploadKYCDocMiddleware = uploadKyc.single('kycDoc');


export let uploadAdditionalDoc = async (req: Request, res: Response, next: NextFunction) => {

	let file = req.file
	
	// console.log(req)
	if(file) {
		console.log(file)
		res.status(200).json({success: true, data: `/uploads/additional-docs/${file.filename}`} as APIResponse)
	}

}

export let uploadAdditionalDocMiddleware = uploadAdditional.single('additionalDoc');


export let downloadHelpers = async (req: Request, res: Response, next: NextFunction) => {

	// try {
		
		let data = await HelperModel.find({}).lean()

		let parser = new Parser()
		// let csv = parser.parse(data)

		const rows = data.map(helper => ({
			EmployeeCode: helper.empCode || '',
			FullName: helper.fullName,
			Gender: helper.gender,
			Phone: helper.phone,
			Email: helper.email,
			TypeOfService: helper.typeOfService,
			Organisation: helper.organisationName,
			VehicleType: helper.vehicleType,
			VehicleNumber: helper.vehicleNumber || '',
			DocumentType: helper.kycDetails?.documentType || '',
			Document: helper.kycDetails?.document || '',
			PhotoUrl: helper.photoUrl,
			AdditionalDocs: helper.additionalDocs
		}))

		let csv = parser.parse(rows)
		
		res.setHeader('Content-Type', 'text/csv')
		res.setHeader('Content-Disposition', 'attachment; filename="helpers.csv"')
		res.status(200).send(csv)
	// }

	// catch(err) {
		// res.status(500).json({success: false, error: (err as Error).message} as APIResponse)
	// }

}



export let getHelpersPaginated = async (req: Request, res: Response, next: NextFunction) => {

	let {search, filterByJob, sortBy, isAscending, page, limit} = req.query

	console.log(req.query)

	let startPageNum = parseInt(page as string)
	let limitNum = parseInt(limit as string)

	// if page num = 12, and if items per page is 3
	// it means we need to skip first 11 pages i.e 11 * 3 i.e 33 documents

	let amtToskip = (startPageNum - 1) * limitNum

	let filter: any = {}

	if(filterByJob && filterByJob != "all") {
		filter.typeOfService = filterByJob
	}

	let sortOrder: SortOrder = isAscending === "true" ? 1 : -1
	let sortField = (sortBy as string)

	if(search) {
		filter.$or = [
			{fullName: {$regex: search, $options: "i"}},
			{empCode: {$regex: search, $options: "i"}},
			{phone: {$regex: search, $options: "i"}},
		]
	}
	

	let data = await HelperModel.find(filter)
	.sort({ [sortField]: sortOrder })
	.skip(amtToskip)
	.limit(limitNum)

	res.status(200).json({success: true, len: data.length, data: data} as APIResponse)

}

