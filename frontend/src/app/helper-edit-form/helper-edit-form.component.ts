import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormControl, FormGroupName, FormGroup, Validators, FormArray } from '@angular/forms';
import { Helper, DocumentType, Gender, KYCDetails, TypeOfService, VehicleType } from '../interfaces/helper.interface';
import { JsonPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HelperService } from '../services/helper.service';
import { APIResponse } from '../interfaces/apiResponse.interface';
import { APP_CONFIG, AppConfig } from '../services/config-service.service';
import { appConfig } from '../app.config';
import { HelperFormSummaryComponent } from '../helper-form-summary/helper-form-summary.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { QrCodeDialogComponent } from '../qr-code-dialog/qr-code-dialog.component';
@Component({
	selector: 'app-helper-edit-form',
	standalone: true,
	imports: [ReactiveFormsModule, JsonPipe, RouterLink, MatInputModule, MatFormFieldModule, MatStepperModule, MatButtonModule, HelperFormSummaryComponent, MatIcon],
	templateUrl: './helper-edit-form.component.html',
	styleUrl: './helper-edit-form.component.css'
})
export class HelperEditFormComponent implements OnInit {

	helperEditForm!: FormGroup;

	isLinear = false

	profilePicFile?: File;
	kycDocFile?: File;
	additionalDocFile?: File;

	profilePicPreviewUrl?: string
	kycDocPreviewUrl?: string;
	additionalDocs?: string;

	constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private helperService: HelperService, private router: Router, @Inject(APP_CONFIG) private appConfig: AppConfig, private snackBar: MatSnackBar) {

	}

	BACKEND = `${this.appConfig.backendUrl}:${this.appConfig.port}`

	typeOfService = TypeOfService
	vehicleType = VehicleType
	gender = Gender
	documentType = DocumentType

	helper!: Partial<Helper>

	step = 0

	helperId: string = ""

	editedHelper!: Helper;

	ngOnInit(): void {
		console.log(`In ngOnInit() inside helper-edit-form`)

		this.helperId = this.route.snapshot.paramMap.get("_id")!
		
		this.helperEditForm = this.formBuilder.group({

			step_0: this.formBuilder.group({
				
				photoUrl:				[""],
				typeOfService:			[TypeOfService.Driver],
				organisationName:		["", Validators.required],
				fullName:				["", Validators.required],
				languages:				this.formBuilder.array([]),
				gender:					[Gender.Male],
				phone:					["", Validators.required],
				email:					[""],
				vehicleType:			[VehicleType.None],
				vehicleNumber:			[""],
				kycDetails:				this.formBuilder.group({
					documentType:		[DocumentType.Aadhaar],
					document:			[""]
				}),

			}),

			step_1: this.formBuilder.group({
				additionalDocs:			[""]
			})

		})

		this.helperService.getHelperById(this.route.snapshot.paramMap.get("_id")||"").subscribe({
			next: async (response: APIResponse<Helper>) => {
				let h = response.data
				console.log(`HERE IN ngOnInit:`)
				console.log(h)
				this.editedHelper = h
				this.helperEditForm.patchValue({
					step_0: h,
					step_1: {
						additionalDocs: h.additionalDocs
					}
				})

				
				for(let language of h.languages) {
					// this.languages.push(language)
					this.languages.push(new FormControl(language));
				}
				
				this.helper = this.helperService.transformFormData(this.helperEditForm.value)
				this.profilePicPreviewUrl = await this.helperService.convertImageUrlToBase64(`${this.BACKEND}${this.helper.photoUrl}`)
				this.kycDocPreviewUrl = `${this.BACKEND}${this.helper.kycDetails?.document}`
			},
			error: (err) => {
				console.error(`Error occured at GET /helpers/${this.helperId} in component: ${(err as Error).message}`)
			}
		})

		this.setVehicleRequired()
		this.updateHelper()

	}

	updateHelper() {
		this.helper = this.helperService.transformFormData(this.helperEditForm.value)
	}

	next() {
		if(this.step + 1 < 2) { this.step++ }
		
	}

	prev() {
		if(this.step - 1 >= 0) { this.step-- }
	}

	/*
	onSubmit() {

		this.helperEditForm.markAllAsTouched()

		for(let child of Object.keys(this.helperEditForm.controls)) {
			if(this.helperEditForm.get(child)?.invalid) {
				let val = parseInt(child.split("_")[1])
				this.step = val
			}
		}


		


		if((this.helperEditForm.pristine && !this.helperEditForm.touched) || (this.helperEditForm.touched && this.helperEditForm.invalid)) {
			console.log("here 11111")
			alert("Fill correct information")
			this.helperEditForm.markAllAsTouched()
			return
		}

		console.log(this.helperEditForm.value)
		// console.log(this.helperEditForm.controls["languages"] as FormArray)
		// alert(JSON.stringify(this.helperEditForm.value))

		// this.helperEditForm.reset()
		this.helperService.updateHelper(this.helperId, this.helperEditForm.value).subscribe({

			next: (response: APIResponse<Helper>) => {
				if(response.success) {
					// alert("User updated succesfully")
					this.router.navigate(["/dashboard", "staff-management", "helpers"])
					
					this.snackBar.open(`Helper updated successfully`, "Close", {
						duration: 5000,
						panelClass: ["success-snackbar"],
						horizontalPosition: "right",
						verticalPosition: "top"
					})

				}
				else {
					alert("Failed to update user")
				}
			},

			error: (err) => {
				
				alert("Error occured during update")
				
				console.error(`Error occured at PUT /helpers/${this.helperId} in component: ${(err as Error).message}`)
			}

		})

	}
	*/

	onSubmit() {
		this.helperEditForm.markAllAsTouched()
		
		for(let child of Object.keys(this.helperEditForm.controls)) {
			if(this.helperEditForm.get(child)?.invalid) {
				let val = parseInt(child.split("_")[1])
				this.step = val
			}
		}

		
		
		const step0 = this.helperEditForm.get("step_0") as FormGroup;
		const step1 = this.helperEditForm.get("step_1") as FormGroup;

		console.log("Form Valid:", this.helperEditForm.valid)
		console.log("Step 0 Valid:", step0.valid)
		console.log("Step 1 Valid:", step1.valid)
		console.log("Errors (step 0):", step0.errors)
		console.log("Errors (step 1):", step1.errors)

		console.log("Photo:", this.helperEditForm.get("step_0.photoUrl")?.value)
		console.log("KYC Doc:", this.helperEditForm.get("step_0.kycDetails.document")?.value)
		console.log("Additional Doc:", this.helperEditForm.get("step_1.additionalDocs")?.value)

		if (step0.invalid || step1.invalid) {
			alert("Fill correct information");
			// this.languages.clear()
			return;
		}

		let formData = new FormData()

		this.updateHelper()

		formData.append("fullName", this.helper.fullName ?? "")
		formData.append("organisationName", this.helper.organisationName ?? "")
		formData.append("phone", this.helper.phone ?? "")
		formData.append("email", this.helper.email ?? "")
		formData.append("gender", this.helper.gender ?? "")
		formData.append("typeOfService", this.helper.typeOfService ?? "")
		formData.append("vehicleType", this.helper.vehicleType ?? "")
		formData.append("vehicleNumber", this.helper.vehicleNumber || "")

		console.log(`Here: ${JSON.stringify(formData, null, 4)}`)

		for (const lang of this.languages.value) {
			formData.append("languages", lang)
		}

		formData.append(
			"kycDetails",
			JSON.stringify({
				documentType: step0.value.kycDetails.documentType,
				document: "" // placeholder, file path handled by backend
			})
		)

		if (this.profilePicFile) {
			formData.append("profilePic", this.profilePicFile)
		}

		if (this.kycDocFile) {
			formData.append("kycDoc", this.kycDocFile)
		}

		if (this.additionalDocFile) {
			formData.append("additionalDoc", this.additionalDocFile)
		}

		const tempFormData = formData as any;
		for (const pair of tempFormData.entries()) {
			console.log(`${pair[0]}:`, pair[1]);
		}
		// return

		this.helperService.updateHelper(this.helperId, formData).subscribe({

			next: (response: APIResponse<Helper>) => {
				if(response.success) {
					// alert("User updated succesfully")
					this.router.navigate(["/dashboard", "staff-management", "helpers"])
					
					this.snackBar.open(`Helper updated successfully`, "Close", {
						duration: 5000,
						panelClass: ["success-snackbar"],
						horizontalPosition: "right",
						verticalPosition: "top"
					})

				}
				else {
					alert("Failed to update user")
				}
			},

			error: (err) => {
				
				alert("Error occured during update")
				
				console.error(`Error occured at PUT /helpers/${this.helperId} in component: ${(err as Error).message}`)
			}

		})


	}


	setVehicleRequired() {
		const step0Group = this.helperEditForm.get('step_0') as FormGroup
	
		step0Group.get('vehicleType')?.valueChanges.subscribe((vehicleType: VehicleType) => {
		const vehicleNumberControl = step0Group.get('vehicleNumber')
	
		if (vehicleType !== VehicleType.None) {
			vehicleNumberControl?.setValidators(Validators.required)
		} else {
			vehicleNumberControl?.clearValidators()
		}
	
		vehicleNumberControl?.updateValueAndValidity()
		})

	}

	onImageFilePick(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0]
		if (file) {

			const reader = new FileReader()
			reader.onload = () => {
				this.profilePicPreviewUrl = reader.result as string
			}
			reader.readAsDataURL(file)

			this.helperEditForm.patchValue({
				step_0: {
					photoUrl: file.name
				}
			})
			this.profilePicFile = file
			this.helperEditForm.get("step_0.photoUrl")?.setValue(file.name)
			this.helperEditForm.get("step_0.photoUrl")?.markAsTouched()
			this.helperEditForm.get("step_0.photoUrl")?.updateValueAndValidity()

			
		}
	}

	onKYCFilePick(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0]
		if (file) {
			
			const kycGroup = this.helperEditForm.get('step_0.kycDetails') as FormGroup
			
			kycGroup.patchValue({
				document: file.name
			})

			this.kycDocPreviewUrl = URL.createObjectURL(file)

			kycGroup.get('document')?.markAsTouched()
			kycGroup.get('document')?.updateValueAndValidity()
			
			this.kycDocFile = file

		}
	}

	onAdditionalDocsPick(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0]
		if (file) {
			this.helperEditForm.patchValue({
				step_1: {
					additionalDocs: file.name
				}
			})			
			this.additionalDocFile = file
			this.helperEditForm.get("step_1.additionalDocs")?.setValue(file.name)
			this.helperEditForm.get("step_1.additionalDocs")?.markAsTouched()
			this.helperEditForm.get("step_1.additionalDocs")?.updateValueAndValidity()
			
		}
	}

	// onImageFilePick(event: Event) {
	// 	let element = event.target as HTMLInputElement
	// 	// console.log(element.files?.item(0))

	// 	this.helperEditForm.patchValue({
	// 		photoUrl: element.files?.item(0)?.name
	// 	})

				
	// 	let formData = new FormData()
	// 	const file = element.files?.item(0);
	// 	if(file) {
	// 		formData.append("profilePic", file)
	// 	}
	// 	console.log(formData.get("profilePic"))

	// 	this.helperService.uploadProfilePic(formData).subscribe({
	// 		next: (response) => {
	// 			console.log(response)
	// 			this.helperEditForm.patchValue({
	// 				step_0: {
	// 					photoUrl: response.data
	// 				}
	// 			})
	// 			this.updateHelper()
	// 		},

	// 		error: (err) => {
	// 			console.log(`Failed to upload profile photo: ${(err as Error).message}`)
	// 		}
	// 	})

	// }
	
	// onKYCFilePick(event: Event) {
	// 	let element = event.target as HTMLInputElement
	// 	console.log(element.files?.item(0))
	// 	const file = element.files?.item(0);
	// 	const kycGroup = this.helperEditForm.get('step_0.kycDetails') as FormGroup;
	// 	if (file) {
	// 		kycGroup.get('document')?.markAsTouched();
	// 		kycGroup.get('document')?.updateValueAndValidity();

	// 		let formData = new FormData()
	// 		formData.append("kycDoc", file)

	// 		this.helperService.uploadKYCDoc(formData).subscribe({
	// 			next: (response) => {
	// 				kycGroup.patchValue({
	// 					document: response.data
	// 				})
	// 				this.updateHelper()
	// 				// alert(`KYC DOC UPLOADED: ${JSON.stringify(response.data, null, 4)}`)
	// 			},

	// 			error: (err) => {
	// 				console.log(`Failed to upload KYC Document: ${(err as Error).message}`)
	// 			}
	// 		})
	// 	}
	// }


	// onAdditionalDocsPick(event: Event) {
	// 	let element = event.target as HTMLInputElement
	// 	// console.log(element.files?.item(0))

	// 	this.helperEditForm.patchValue({
	// 		step_0: {
	// 			kycDetails: {
	// 				...this.helperEditForm.value.kycDetails,
	// 				document: element.files?.item(0)?.name,
	// 				documentType: this.helperEditForm.value.step_0.kycDetails.documentType
	// 			}
	// 		}
	// 	})
	// }

	get languages() {
		// console.log(this.helperEditForm.controls["languages"] as FormArray)
		return this.helperEditForm.controls["step_0"].get("languages") as FormArray
	}

	onLanguageChange(event: Event) {
		let e = event.target as HTMLSelectElement
		this.languages.clear()
		Array.from(e.selectedOptions).forEach((option) => {
			this.languages.push(new FormControl(option.value))
		})
		// console.log(event)
		// this.languages.push(e.value)
		// console.log(this.languages)
	}

	handleStepperChange(e: StepperSelectionEvent) {
		console.log(e)
		this.step = e.selectedIndex

	}

	showKycDoc(doc: string | undefined) {
		if(doc == undefined) return
		
		let url = `${this.BACKEND}${doc}`
		console.log(url)
		window.open(url, '_blank');
	}

}
