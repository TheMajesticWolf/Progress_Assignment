import { Component, Inject, Input, OnInit } from '@angular/core';
import { Helper, Gender, VehicleType, DocumentType, TypeOfService } from '../interfaces/helper.interface';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HelperService } from '../services/helper.service';
import { APP_CONFIG, AppConfig } from '../services/config-service.service';
import { MatDialog } from '@angular/material/dialog';
import { QrCodeDialogComponent } from '../qr-code-dialog/qr-code-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Component({
	selector: 'app-helper-detailed-view',
	standalone: true,
	imports: [DatePipe, RouterModule, MatIconModule],
	templateUrl: './helper-detailed-view.component.html',
	styleUrl: './helper-detailed-view.component.css'
})
export class HelperDetailedViewComponent implements OnInit {

	// helper: Helper = {
	// 	// id?: string,
	// 	// createdAt?: string,
	// 	// updatedAt?: string,

	// 	photoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg",
	// 	typeOfService: TypeOfService.Driver,
	// 	organisationName: "Organanisation name",
	// 	fullName: "Name 1",
	// 	languages: ["English", "Hindi", "Telugu"],
	// 	gender: Gender.Male,
	// 	phone: "0123456789",
	// 	email: "email@dummy.com",
	// 	vehicleType: VehicleType.Bike,
	// 	vehicleNumber: "TS08AB0123",
	// 	kycDetails: {
	// 		document: "Passport",
	// 		documentType: DocumentType.Aadhaar
	// 	},
	// }

	@Input({required: true}) helper!: Helper

	constructor(private helperService: HelperService, @Inject(APP_CONFIG) private appConfig: AppConfig, private dialog: MatDialog, private snackBar: MatSnackBar) {
		// this.helper.createdAt = this.helper.createdAt || new Date().toLocaleString()
	}

	BACKEND = `${this.appConfig.backendUrl}:${this.appConfig.port}`

	ngOnInit(): void {
		
	}

	handleDelete(_id: string) {
		console.log(`Delete called for mongo id: ${_id}`)

		let dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: "400px",
			data: {
				title: "Confirm Delete",
				message: "Are you sure you want to delete this item?",
				confirmText: "Delete",
				cancelText: "Cancel"
			} as ConfirmDialogData
		})

		dialogRef.afterClosed().subscribe((res) => {
			if(res === true) {
				this.helperService.deleteHelperById(_id).subscribe({
					next: (data) => {
						console.log(`Inside delete subscribe next: ${JSON.stringify(data, null, 4)}`)
						this.snackBar.open("Helper deleted successfully", "Close", {
							duration: 5000,
							horizontalPosition: "right",
							verticalPosition: "top",
							panelClass: ["success-snackbar"],


						} as MatSnackBarConfig)
					},
					
					error: (err) => {
						console.log(`Inside delete subscribe error: ${(err as Error).message}`)

					}
				})
			}
		})


	}

	showQr() {
		this.dialog.open(QrCodeDialogComponent, {
			data: {
				qrData: JSON.stringify(this.helper, null, 4) || 'No-ID',
				dialogTitle: `QR Code for '${this.helper.fullName}'`
			}
		})
	}

	showKycDoc() {
		let url = `${this.BACKEND}${this.helper.kycDetails.document}`
		console.log(url)
		window.open(url, '_blank');
	}

}
