import type { Request, Response } from "express"
import HelperModel from "../models/Helper.model.js"
import type { Helper } from "../interfaces/helper.interface.js"
import multer from 'multer'
import path from "path"
import fs from 'fs'

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

export let testAPI = (req: Request, res: Response) => {
	res.send("HEewwfwllo world")
}

export let getHelpers = async (req: Request, res: Response) => {
	
	try {
		
		let data = await HelperModel.find({})
		res.status(200).json({success: true, data})
		
	}

	catch(err) {
		res.status(500).json({success: false, error: (err as Error).message})
	}

	
}

export let addHelper = async (req: Request, res: Response) => {

	let userData: Helper = req.body;

	let helper: Helper = userData as Helper

	try {
		
		let data = await new HelperModel(helper).save()
		res.status(201).json({success: true, data})
		
	}
	
	catch(err) {
		res.status(500).json({success: false, error: (err as Error).message})
	}
	
}

export let getHelperById = async (req: Request, res: Response) => {
	
	let _id = req.params["_id"]
	
	try {
		
		let data = await HelperModel.findById(_id, {}, {})

		if(data) {
			return res.status(200).json({success: true, data})
		}
		
		res.status(404).json({success: true, error: "Helper does not exist"})
		
	}
	
	catch(err) {
		res.status(500).json({success: false, error: (err as Error).message})
	}
	
	
	
}


export let deleteHelperById = async (req: Request, res: Response) => {
	
	let _id = req.params["_id"]
	
	try {
		
		let data = await HelperModel.findByIdAndDelete(_id, {})
		
		if(data) {
			return res.status(200).json({success: true, data})
		}
		res.status(404).json({success: true, error: "Helper does not exist for deletion"})
		
	}
	
	catch(err) {
		res.status(500).json({success: false, error: (err as Error).message})
	}
	
	
	
}


export let updateHelperById = async (req: Request, res: Response) => {

	// throw new Error("This is a thrown error for testing")
	
	let _id = req.params["_id"]
	
	try {
		
		let data = await HelperModel.findByIdAndUpdate(_id, (req.body as Helper), {new: true})
		
		if(data) {
			return res.status(200).json({success: true, data})
		}
		res.status(404).json({success: true, error: "Helper does not exist for updation"})
		
	}
	
	catch(err) {
		res.status(500).json({success: false, error: (err as Error).message})
	}
	

}

export let uploadProfilePic = async (req: Request, res: Response) => {

	let file = req.file
	
	console.log(req)
	if(file) {
		res.status(200).json({success: true, data: `/uploads/profile-pics/${file.filename}`})
	}

}

export let uploadProfilePicMiddleware = uploadProfilePics.single('profilePic');




export let uploadKYCDoc = async (req: Request, res: Response) => {

	let file = req.file
	
	console.log(req)
	if(file) {
		res.status(200).json({success: true, data: `/uploads/kyc-docs/${file.filename}`})
	}

}

export let uploadKYCDocMiddleware = uploadKyc.single('kycDoc');


export let uploadAdditionalDoc = async (req: Request, res: Response) => {

	let file = req.file
	
	// console.log(req)
	if(file) {
		console.log(file)
		res.status(200).json({success: true, data: `/uploads/additional-docs/${file.filename}`})
	}

}

export let uploadAdditionalDocMiddleware = uploadAdditional.single('additionalDoc');

