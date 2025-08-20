import { Component, Inject, Input, OnInit } from '@angular/core';
import { Helper } from '../interfaces/helper.interface';
import { DatePipe, JsonPipe } from '@angular/common';
import { APP_CONFIG, AppConfig } from '../services/config-service.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
	selector: 'app-helper-form-summary',
	standalone: true,
	imports: [DatePipe, MatIconModule, JsonPipe],
	templateUrl: './helper-form-summary.component.html',
	styleUrl: './helper-form-summary.component.css'
})
export class HelperFormSummaryComponent implements OnInit {

	@Input() helper!: Partial<Helper>
	@Input() profilePicPreviewUrl!: string | undefined

	constructor(@Inject(APP_CONFIG) private appConfig: AppConfig) {

	}

	ngOnInit() {
		console.log(`URL PREVIEW IS: ${this.profilePicPreviewUrl}`)
	}

	BACKEND = `${this.appConfig.backendUrl}:${this.appConfig.port}`

	showAdditionalDoc(doc: string | undefined) {
		if(doc == undefined) return
		
		let url = `${this.BACKEND}${doc}`
		console.log(url)
		window.open(url, '_blank');
	}

}
