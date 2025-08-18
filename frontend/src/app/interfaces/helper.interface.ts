export enum TypeOfService {
	Maid = "Maid",
	Cook = "Cook",
	Nurse = "Nurse",
	Driver = "Driver"
}

export enum Gender {
	Male = "Male",
	Female = "Female",
	Other = "Other"
}

export enum VehicleType {
	None = "None",
	Auto = "Auto",
	Bike = "Bike",
	Taxi = "Taxi"

}

export enum DocumentType {
	Aadhaar = "Aadhaar",
	Passport = "Passport",
	License = "License"
}

export interface KYCDetails {
	documentType: DocumentType
	document: string
}

export interface Helper {

	_id: string
	createdAt?: string
	updatedAt?: string

	identificationCard: string
	empCode?: string
	photoUrl: string
	typeOfService: TypeOfService
	organisationName: string
	fullName: string
	languages: string[]
	gender: Gender
	phone: string
	email: string
	vehicleType: VehicleType
	vehicleNumber?: string
	kycDetails: KYCDetails
	additionalDocs?: string
}
