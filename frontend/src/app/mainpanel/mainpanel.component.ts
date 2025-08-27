import { Component, OnInit } from '@angular/core';
import { HelperCardComponent } from '../helper-card/helper-card.component';
import { HelperDetailedViewComponent } from '../helper-detailed-view/helper-detailed-view.component';
import { HelperAddFormComponent } from '../helper-add-form/helper-add-form.component';
import { RouterModule } from '@angular/router';
import { Gender, Helper, TypeOfService, VehicleType, DocumentType } from '../interfaces/helper.interface';

@Component({
	selector: 'app-mainpanel',
	standalone: true,
	imports: [HelperCardComponent, HelperDetailedViewComponent, HelperAddFormComponent, RouterModule],
	templateUrl: './mainpanel.component.html',
	styleUrl: './mainpanel.component.css'
})
export class MainpanelComponent implements OnInit {

	// addingHelepr: boolean = false
	// helpers: Helper[] = []

	// selectedHelper!: Helper;

	constructor() {

	}

	ngOnInit(): void {

	}

	// onHelperSelect(helepr: Helper) {
		// console.log(helepr)
		// this.selectedHelper = helepr
	// }

}
