import { DocumentType, Gender, TypeOfService, VehicleType } from "../interfaces/helper.interface.js";
import type { Helper, KYCDetails } from "../interfaces/helper.interface.js";
import { v4 as uuidv4 } from 'uuid';
import { Schema } from "mongoose";

import mongoose from "mongoose";

interface HelperDocument extends Helper, Document { }

const kycDetailsSchema = new mongoose.Schema({
	documentType: {
		type: Schema.Types.String,
		required: true
	},
	document: {
		type: Schema.Types.String,
		required: true
	}
})

const helperSchema = new mongoose.Schema<HelperDocument>({

	empCode: {
		type: Schema.Types.String,
		unique: true,
		required: true
	},

	identificationCard: {
		type: Schema.Types.String,
		required: true
	},

	photoUrl: {
		type: Schema.Types.String,
		required: true
	},

	typeOfService: {
		type: Schema.Types.String,
		required: true,
		enum: Object.values(TypeOfService)
	},

	organisationName: {
		type: Schema.Types.String,
		required: true
	},

	fullName: {
		type: Schema.Types.String,
		required: true
	},

	languages: [
		{ type: Schema.Types.String }
	],

	gender: {
		type: Schema.Types.String,
		required: true,
		enum: Object.values(Gender)
	},

	phone: {
		type: Schema.Types.String,
		required: true,
		unique: true,
	},

	email: {
		type: Schema.Types.String
	},

	vehicleType: {
		type: Schema.Types.String,
		enum: Object.values(VehicleType)
	},

	vehicleNumber: {
		type: Schema.Types.String
	},

	kycDetails: {
		type: kycDetailsSchema,
		required: true
	},

	additionalDocs: {
		type: Schema.Types.String
	}

}, { timestamps: true })

helperSchema.pre("validate", async function (next) {
	if (!this.isNew) return next();

	this.empCode = uuidv4();
	this.identificationCard = "Generated from backend"
	next();
});

const HelperModel = mongoose.model<HelperDocument>("Helpers", helperSchema)

export default HelperModel
