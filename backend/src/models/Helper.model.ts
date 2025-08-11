import { DocumentType, Gender, TypeOfService, VehicleType } from "../interfaces/helper.interface.js";
import type { Helper, KYCDetails } from "../interfaces/helper.interface.js";
import { v4 as uuidv4 } from 'uuid';

import mongoose from "mongoose";

interface HelperDocument extends Helper, Document { }

const kycDetailsSchema = new mongoose.Schema({
	documentType: {
		type: String,
		required: true
	},
	document: {
		type: String,
		required: true
	}
})

const helperSchema = new mongoose.Schema<HelperDocument>({

	empCode: {
		type: String,
		unique: true,
		required: true
	},

	identificationCard: {
		type: String,
		required: true
	},

	photoUrl: {
		type: String,
	},

	typeOfService: {
		type: String,
		required: true,
		enum: Object.values(TypeOfService)
	},

	organisationName: {
		type: String,
		required: true
	},

	fullName: {
		type: String,
		required: true
	},

	languages: [
		{ type: String }
	],

	gender: {
		type: String,
		required: true,
		enum: Object.values(Gender)
	},

	phone: {
		type: String,
		required: true,
		unique: true,
	},

	email: {
		type: String
	},

	vehicleType: {
		type: String,
		enum: Object.values(VehicleType)
	},

	vehicleNumber: {
		type: String
	},

	kycDetails: {
		type: kycDetailsSchema,
		required: true
	},

}, { timestamps: true })

helperSchema.pre("validate", async function (next) {
	if (!this.isNew) return next();

	this.empCode = uuidv4();
	this.identificationCard = "Generated from backend"
	next();
});

const HelperModel = mongoose.model<HelperDocument>("Helpers", helperSchema)

export default HelperModel
