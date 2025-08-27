import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Helper } from '../interfaces/helper.interface';
import { APP_CONFIG, AppConfig } from '../services/config-service.service';

@Component({
	selector: 'app-helper-card',
	standalone: true,
	imports: [],
	templateUrl: './helper-card.component.html',
	styleUrl: './helper-card.component.css'
})
export class HelperCardComponent implements OnInit {

	@Input({required: true}) helper!: Helper
	@Output() helperSelectEmit = new EventEmitter<Helper>()
	@Input() isSelectedHelper = false

	emitSelectEvent() {
		this.helperSelectEmit.emit(this.helper)
	}

	constructor(@Inject(APP_CONFIG) private appConfig: AppConfig) {

	}

	BACKEND = `${this.appConfig.backendUrl}:${this.appConfig.port}`

	ngOnInit(): void {
		
	}

}
