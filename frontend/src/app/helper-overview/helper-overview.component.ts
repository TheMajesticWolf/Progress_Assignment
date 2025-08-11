import { Component } from '@angular/core';
import { HelperCardComponent } from '../helper-card/helper-card.component';
import { HelperDetailedViewComponent } from '../helper-detailed-view/helper-detailed-view.component';
import { Gender, Helper, TypeOfService, VehicleType, DocumentType } from '../interfaces/helper.interface';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HelperService } from '../services/helper.service';


@Component({
	selector: 'app-helper-overview',
	standalone: true,
	imports: [HelperCardComponent, HelperDetailedViewComponent, RouterModule, FormsModule],
	templateUrl: './helper-overview.component.html',
	styleUrl: './helper-overview.component.css'
})
export class HelperOverviewComponent {
	helpers: Helper[] = []
	addingHelper: boolean = false

	selectedHelper!: Helper;

	sortBy = "name"
	searchText = ""
	isAscending = true
	filteredHelpers: Helper[] = []

	filterByJob = "all"
	
	onFilterChange() {
		this.filteredHelpers = this.helpers.filter(h => {
			return this.filterByJob === "all" || h.typeOfService === this.filterByJob
		})
		this.selectedHelper = this.filteredHelpers[0]
	}

	constructor(private helperService: HelperService) {

	}

	ngOnInit(): void {
		let temp: Helper[] = []

		
		for (let i = 0; i < 10; i++) {
			let helper: Helper = {
				empCode: `${Math.round(1000 + (Math.random() * 1000))}`,
				_id: `${Math.round(1000000 + (Math.random() * 1000000))}`,
				identificationCard: "Testing",
				// createdAt?: string,
				// updatedAt?: string,

				photoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg",
				typeOfService: TypeOfService.Driver,
				organisationName: "Organanisation name",
				fullName: `Name ${Math.round(1000 + (Math.random() * 1000))}`,
				languages: ["English", "Hindi", "Telugu"],
				gender: Gender.Male,
				phone: `${Math.round(Math.random() * 1e10)}`,
				email: "email@dummy.com",
				vehicleType: VehicleType.Bike,
				vehicleNumber: "TS08AB0123",
				kycDetails: {
					document: "Passport",
					documentType: DocumentType.Aadhaar
				},
			}
			temp.push(helper)
		}
		
		this.helperService.helpers$.subscribe((data) => {
			this.helpers = data
			this.filteredHelpers = this.helpers
			
			this.sortHelpers()
			console.log("HERE 6868")
			this.selectedHelper = this.filteredHelpers[0]
		})





	}

	startAdd() {
		this.addingHelper = true
	}

	stopAdd() {
		this.addingHelper = false
	}

	onHelperSelect(helepr: Helper) {
		console.log(helepr)
		this.selectedHelper = helepr
	}

	sortHelpers() {
		// this.helpers = [...this.helpers].sort((a, b) => a.phone - b.phone)
		// this.helpers = [...this.helpers].sort((a, b) => a.phone.localeCompare(b.phone, undefined, { sensitivity: 'base' }));
		
		if(this.sortBy === "name") {
			this.filteredHelpers = [...this.filteredHelpers].sort((a, b) => a.fullName.localeCompare(b.fullName, undefined, { sensitivity: 'base' }));
		}
		else if(this.sortBy === "employeeId") {
			this.filteredHelpers = [...this.filteredHelpers].sort((a, b) =>   (a.empCode ?? '').localeCompare(b.empCode ?? '', undefined, { sensitivity: 'base' }));
		}
		else if(this.sortBy === "joiningTime") {
			this.filteredHelpers = [...this.filteredHelpers].sort((a, b) =>   (a.updatedAt ?? '').localeCompare(b.updatedAt ?? '', undefined, { sensitivity: 'base' }));
		}
		this.filteredHelpers = this.isAscending ? this.filteredHelpers : [...this.filteredHelpers].reverse()
		this.selectedHelper = this.filteredHelpers[0]
		console.log(this.helpers)
	}

	filterHelpers() {
		let filterString = this.searchText.trim().toLowerCase()
		console.log("Filter helper input changed")
		this.filteredHelpers = this.helpers.filter(h => {
			
			let condition = h.fullName.toLowerCase().includes(filterString) ||
			h.empCode?.toLowerCase().includes(filterString) ||
			h.phone.toLowerCase().includes(filterString) ||
			filterString.length === 0

			return condition
		})
		this.sortHelpers()
		console.log(this.filteredHelpers)
	}

	downloadHelpers() {
		const json = JSON.stringify(this.helpers, null, 4)
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob)

		const a = document.createElement("a")
		a.href = url;
		a.download = "helpers.json"
		a.style.display = "none"
		document.body.appendChild(a)
		a.click();
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	reverseList() {
		// this.filteredHelpers = [...this.filteredHelpers].reverse()
		// this.selectedHelper = this.filteredHelpers[0]
		this.isAscending = !this.isAscending
		this.sortHelpers()
	}
}
