import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';
import { APP_CONFIG, AppConfig } from '../services/config-service.service';
import { HelperService } from '../services/helper.service';

@Component({
	selector: 'app-error-page',
	standalone: true,
	imports: [],
	templateUrl: './error-page.component.html',
	styleUrl: './error-page.component.css'
})
export class ErrorPageComponent implements OnInit {

	code?: string
	message?: string
	statusText?: string

	constructor(private route: ActivatedRoute, private router: Router, private helperService: HelperService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

	ngOnInit(): void {

		this.route.queryParamMap.subscribe((params) => {
			console.log(params)
			this.code = params.get("code") || undefined
			this.message = params.get("message") || undefined
			this.statusText = params.get("statusText") || undefined
		})

		
		let dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: "400px",
			data: {
				title: "Confirm Delete",
				message: "An error occured in an HTTP request",
				confirmText: "Go to home",
				cancelText: "Dismiss",
				onCancel: () => {
					
				},
				onConfirm: () => {
					this.router.navigate(["/dashboard", "staff-management", "helpers"])
				},
			} as ConfirmDialogData
		})

		dialogRef.afterClosed().subscribe((confirmStatus: boolean) => { })


	}


}
