import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
	selector: 'app-qr-code-dialog',
	standalone: true,
	imports: [CommonModule, MatDialogModule, MatButtonModule, QRCodeModule],
	templateUrl: './qr-code-dialog.component.html',
	styleUrl: './qr-code-dialog.component.css'
})
export class QrCodeDialogComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public data: { qrData: string, dialogTitle: string }) { }

	downloadQRCode(qrCodeElement: any) {
		const canvas: HTMLCanvasElement = qrCodeElement.qrcElement.nativeElement.querySelector('canvas');

		if (canvas) {
			const link = document.createElement('a');
			link.href = canvas.toDataURL('image/png');
			link.download = 'qr-code.png';
			link.click();
		} else {
			console.error('QR canvas not found.');
		}
	}

}
