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
@Component({
	selector: 'app-helper-add-form',
	standalone: true,
	imports: [QRCodeModule, ReactiveFormsModule, JsonPipe, RouterLink, MatInputModule, MatFormFieldModule, MatStepperModule, MatButtonModule, HelperFormSummaryComponent],
	templateUrl: './helper-add-form.component.html',
	styleUrl: './helper-add-form.component.css'
})
export class HelperAddFormComponent implements OnInit {

	helperAddForm!: FormGroup;

	isLinear = false

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
				typeOfService:			[TypeOfService.Driver],
				organisationName:		["", Validators.required],
				fullName:				["", Validators.required],
				languages:				this.formBuilder.array([], this.minSelectedLanguages(1)),
				gender:					[Gender.Male],
				phone:					["", Validators.required],
				email:					[""],
				vehicleType:			[VehicleType.None],
				vehicleNumber:			[""],
				kycDetails:				this.formBuilder.group({
					documentType:		[DocumentType.Aadhaar],
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

	onSubmit() {

		console.log(this.helperAddForm)

		this.helperAddForm.markAllAsTouched()

		for(let child of Object.keys(this.helperAddForm.controls)) {
			if(this.helperAddForm.get(child)?.invalid) {
				let val = parseInt(child.split("_")[1])
				this.step = val
			}
		}

		const step0 = this.helperAddForm.get("step_0") as FormGroup;
		const step1 = this.helperAddForm.get("step_1") as FormGroup;

		if (step0.invalid || step1.invalid) {
			alert("Fill correct information");
			this.languages.clear()
			return;
		}


		console.log(this.helperAddForm.value)
		// console.log(this.helperAddForm.controls["languages"] as FormArray)
		// alert(JSON.stringify(this.helperAddForm.value))

		this.helperService.addHelper(this.helperAddForm.value).subscribe({
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
		let element = event.target as HTMLInputElement
		// console.log(element.files?.item(0))

		this.helperAddForm.patchValue({
			photoUrl: element.files?.item(0)?.name
		})
		
		let formData = new FormData()
		const file = element.files?.item(0);
		if(file) {
			formData.append("profilePic", file)
		}
		console.log(formData.get("profilePic"))

		this.helperService.uploadProfilePic(formData).subscribe({
			next: (response) => {
				console.log(response)
				this.helperAddForm.patchValue({
					step_0: {
						photoUrl: response.data
					}
				})
			},

			error: (err) => {
				console.log(`Failed to upload profile photo: ${(err as Error).message}`)
			}
		})

	}
	
	onKYCFilePick(event: Event) {
		let element = event.target as HTMLInputElement
		console.log(element.files?.item(0))
		const file = element.files?.item(0);
		const kycGroup = this.helperAddForm.get('step_0.kycDetails') as FormGroup;
		if (file) {
			kycGroup.patchValue({
			document: file.name
			})
			kycGroup.get('document')?.markAsTouched();
			kycGroup.get('document')?.updateValueAndValidity();


			let formData = new FormData()
			formData.append("kycDoc", file)

			this.helperService.uploadKYCDoc(formData).subscribe({
				next: (response) => {
					kycGroup.patchValue({
						document: response.data
					})
					// alert(`KYC DOC UPLOADED: ${JSON.stringify(response.data, null, 4)}`)
				},

				error: (err) => {
					console.log(`Failed to upload KYC Document: ${(err as Error).message}`)
				}
			})
		}
	}


	onAdditionalDocsPick(event: Event) {
		let element = event.target as HTMLInputElement
		// console.log(element.files?.item(0))

		this.helperAddForm.patchValue({
			kycDetails: {
				...this.helperAddForm.value.kycDetails,
				document: element.files?.item(0)?.name
			}
		})
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

}
