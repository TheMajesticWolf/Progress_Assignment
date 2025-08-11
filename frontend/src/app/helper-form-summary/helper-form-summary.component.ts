import { Component, Inject, Input } from '@angular/core';
import { Helper } from '../interfaces/helper.interface';
import { DatePipe } from '@angular/common';
import { APP_CONFIG, AppConfig } from '../services/config-service.service';

@Component({
	selector: 'app-helper-form-summary',
	standalone: true,
	imports: [DatePipe],
	templateUrl: './helper-form-summary.component.html',
	styleUrl: './helper-form-summary.component.css'
})
export class HelperFormSummaryComponent {

	@Input() helper!: Partial<Helper>

	constructor(@Inject(APP_CONFIG) private appConfig: AppConfig) {

	}

	BACKEND = `${this.appConfig.backendUrl}:${this.appConfig.port}`

}
