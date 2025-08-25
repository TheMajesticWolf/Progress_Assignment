import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormControl, FormGroupName, FormGroup, Validators, FormArray, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Helper, DocumentType, Gender, KYCDetails, TypeOfService, VehicleType } from '../interfaces/helper.interface';
import { JsonPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { QrCodeDialogComponent } from '../qr-code-dialog/qr-code-dialog.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HelperService } from '../services/helper.service';
import { APIResponse } from '../interfaces/apiResponse.interface';
import { APP_CONFIG, AppConfig } from '../services/config-service.service';
import { HelperFormSummaryComponent } from '../helper-form-summary/helper-form-summary.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
@Component({
	selector: 'app-helper-add-form',
	standalone: true,
	imports: [QRCodeModule, ReactiveFormsModule, JsonPipe, RouterLink, MatInputModule, MatFormFieldModule, MatStepperModule, MatButtonModule, HelperFormSummaryComponent, MatIcon],
	templateUrl: './helper-add-form.component.html',
	styleUrl: './helper-add-form.component.css'
})
export class HelperAddFormComponent implements OnInit {

	helperAddForm!: FormGroup;

	isLinear = false

	profilePicFile?: File;
	kycDocFile?: File;
	additionalDocFile?: File;

	profilePicPreviewUrl?: string
	kycDocPreviewUrl?: string;
	additionalDocs?: string;




	constructor(private formBuilder: FormBuilder, private helperService: HelperService, private router: Router, @Inject(APP_CONFIG) private appConfig: AppConfig, private dialog: MatDialog, private snackBar: MatSnackBar) {

	}
	
	BACKEND = `${this.appConfig.backendUrl}:${this.appConfig.port}`

	typeOfService = TypeOfService
	vehicleType = VehicleType
	gender = Gender
	documentType = DocumentType
	
	helper!: Partial<Helper>

	step = 0

	ngOnInit(): void {
		
		this.helperAddForm = this.formBuilder.group({

			step_0: this.formBuilder.group({
				
				photoUrl:				["", Validators.required],
				typeOfService:			[TypeOfService.Driver, TypeOfService],
				organisationName:		["", Validators.required],
				fullName:				["", Validators.required],
				languages:				this.formBuilder.array([], this.minSelectedLanguages(1)),
				gender:					[Gender.Male],
				phone:					["", Validators.required],
				email:					["", Validators.email],
				vehicleType:			[VehicleType.None],
				vehicleNumber:			[""],
				kycDetails:				this.formBuilder.group({
					documentType:		[DocumentType.Aadhaar, DocumentType],
					document:			["", Validators.required]
				}),

			}),

			step_1: this.formBuilder.group({
				additionalDocs:			[""]
			})

		})

		this.setVehicleRequired()
		this.updateHelper()

	}

	minSelectedLanguages(min: number): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const formArray = control as FormArray;
			return formArray && formArray.length >= min ? null : { minLanguages: true };
		}
	}

	setVehicleRequired() {
		const step0Group = this.helperAddForm.get('step_0') as FormGroup
	
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

	updateHelper() {
		this.helper = this.helperService.transformFormData(this.helperAddForm.value)
	}


	next() {
		if(this.step + 1 < 3) { this.step++ }
		
	}

	prev() {
		if(this.step - 1 >= 0) { this.step-- }
	}

	// onSubmit() {

	// 	console.log(this.helperAddForm)

	// 	this.helperAddForm.markAllAsTouched()

	// 	for(let child of Object.keys(this.helperAddForm.controls)) {
	// 		if(this.helperAddForm.get(child)?.invalid) {
	// 			let val = parseInt(child.split("_")[1])
	// 			this.step = val
	// 		}
	// 	}

	// 	const step0 = this.helperAddForm.get("step_0") as FormGroup;
	// 	const step1 = this.helperAddForm.get("step_1") as FormGroup;

	// 	if (step0.invalid || step1.invalid) {
	// 		alert("Fill correct information");
	// 		// this.languages.clear()
	// 		return;
	// 	}


	// 	console.log(this.helperAddForm.value)
	// 	// console.log(this.helperAddForm.controls["languages"] as FormArray)
	// 	// alert(JSON.stringify(this.helperAddForm.value))

	// 	this.helperService.addHelper(this.helperAddForm.value).subscribe({
	// 		next: (response: APIResponse<Helper>) => {
	// 			console.log(`Added new helper: ${JSON.stringify(response.data, null, 4)}`)

	// 			if(response.success) {
	// 				// alert("User added successfully")
	// 				this.dialog.open(QrCodeDialogComponent, {
	// 					data: {
	// 						qrData: JSON.stringify(response.data, null, 4) || 'No-ID',
	// 						dialogTitle: `QR Code for '${this.helper.fullName}'`
	// 					}
	// 				})
	// 				this.router.navigate(["/dashboard", "staff-management", "helpers"])
	// 				this.snackBar.open(`Helper added successfully`, "Close", {
	// 					duration: 5000,
	// 					panelClass: ["success-snackbar"],
	// 					horizontalPosition: "right",
	// 					verticalPosition: "top"
	// 				})
	// 			}

	// 		},

	// 		error: (err) => {
	// 			console.log(`Error adding helper: ${(err as Error).message}`)
	// 		}
	// 	})


	// }

	onSubmit() {
		this.helperAddForm.markAllAsTouched()
		
		for(let child of Object.keys(this.helperAddForm.controls)) {
			if(this.helperAddForm.get(child)?.invalid) {
				let val = parseInt(child.split("_")[1])
				this.step = val
			}
		}

		
		
		const step0 = this.helperAddForm.get("step_0") as FormGroup;
		const step1 = this.helperAddForm.get("step_1") as FormGroup;

		console.log("Form Valid:", this.helperAddForm.valid)
		console.log("Step 0 Valid:", step0.valid)
		console.log("Step 1 Valid:", step1.valid)
		console.log("Errors (step 0):", step0.errors)
		console.log("Errors (step 1):", step1.errors)

		console.log("Photo:", this.helperAddForm.get("step_0.photoUrl")?.value)
		console.log("KYC Doc:", this.helperAddForm.get("step_0.kycDetails.document")?.value)
		console.log("Additional Doc:", this.helperAddForm.get("step_1.additionalDocs")?.value)

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

		// Append files if they exist
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

		this.helperService.addHelper(formData).subscribe({
			next: (response: APIResponse<Helper>) => {
				console.log(`Added new helper: ${JSON.stringify(response.data, null, 4)}`)

				if(response.success) {
					// alert("User added successfully")
					this.dialog.open(QrCodeDialogComponent, {
						data: {
							qrData: JSON.stringify(response.data, null, 4) || 'No-ID',
							dialogTitle: `QR Code for '${this.helper.fullName}'`
						}
					})
					this.router.navigate(["/dashboard", "staff-management", "helpers"])
					this.snackBar.open(`Helper added successfully`, "Close", {
						duration: 5000,
						panelClass: ["success-snackbar"],
						horizontalPosition: "right",
						verticalPosition: "top"
					})
				}

			},

			error: (err) => {
				console.log(`Error adding helper: ${(err as Error).message}`)
			}
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

			this.helperAddForm.patchValue({
				step_0: {
					photoUrl: file.name
				}
			})
			this.profilePicFile = file
			this.helperAddForm.get("step_0.photoUrl")?.setValue(file.name)
			this.helperAddForm.get("step_0.photoUrl")?.markAsTouched()
			this.helperAddForm.get("step_0.photoUrl")?.updateValueAndValidity()

			
		}
	}

	onKYCFilePick(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0]
		if (file) {
			
			const kycGroup = this.helperAddForm.get('step_0.kycDetails') as FormGroup
			
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
			this.helperAddForm.patchValue({
				step_1: {
					additionalDocs: file.name
				}
			})			
			this.additionalDocFile = file
			this.helperAddForm.get("step_1.additionalDocs")?.setValue(file.name)
			this.helperAddForm.get("step_1.additionalDocs")?.markAsTouched()
			this.helperAddForm.get("step_1.additionalDocs")?.updateValueAndValidity()
			
		}
	}

	get languages() {
		// console.log("HErehbadaj")
		// console.log(this.helperAddForm.controls["step_0"].get("languages") as FormArray)
		return this.helperAddForm.controls["step_0"].get("languages") as FormArray
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
