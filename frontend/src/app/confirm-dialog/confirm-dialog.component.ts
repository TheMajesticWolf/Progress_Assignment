import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions, MatDialogContent } from '@angular/material/dialog';

@Component({
	selector: 'app-confirm-dialog',
	standalone: true,
	imports: [MatDialogActions, MatDialogContent],
	templateUrl: './confirm-dialog.component.html',
	styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {

	constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {

	}

	onSuccess() {
		this.data.onConfirm?.()
		this.dialogRef.close(true)
	}

	onFailure() {
		this.data.onCancel?.()
		this.dialogRef.close(false)
	}


}


export interface ConfirmDialogData {
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
}