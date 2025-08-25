import path from "path"
import HelperModel from "../models/Helper.model.js"
import fs from 'fs'

export let deleteUnReferencedFiles = async () => {

	let referenced = new Set()
	
	let data = await HelperModel.find()
	// console.log(data)

	let temp = data.map((helper) => {

		let photoUrlPath = path.resolve(helper.photoUrl.substring(1))
		let kycPath = path.resolve(helper.kycDetails.document.substring(1))
		let additionalDocPath = helper.additionalDocs ? path.resolve(helper.additionalDocs.substring(1)) : undefined

		referenced.add(photoUrlPath)
		referenced.add(kycPath)
		if(additionalDocPath) {
			referenced.add(additionalDocPath)
		}
		return helper
	})

	// console.log(referenced)


	const uploadsDir = path.resolve('uploads')

	const recurse = (dirPath: string) => {
		const files = fs.readdirSync(dirPath)

		files.forEach(file => {
			const filePath = path.join(dirPath, file)
			const stat = fs.statSync(filePath)

			if (stat.isDirectory()) {
				recurse(filePath) 
			} 
			else {
				if (!referenced.has(filePath)) {
					console.log(`Deleting file: ${filePath}`)
					fs.unlinkSync(filePath)
				}
			}
		})
	}

	recurse(uploadsDir);

}


deleteUnReferencedFiles()