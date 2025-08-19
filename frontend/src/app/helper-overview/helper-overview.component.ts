import { Component } from '@angular/core';
import { HelperCardComponent } from '../helper-card/helper-card.component';
import { HelperDetailedViewComponent } from '../helper-detailed-view/helper-detailed-view.component';
import { Gender, Helper, TypeOfService, VehicleType, DocumentType } from '../interfaces/helper.interface';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HelperService } from '../services/helper.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { PaginationParams } from '../interfaces/paginationParams.interface';


@Component({
	selector: 'app-helper-overview',
	standalone: true,
	imports: [HelperCardComponent, HelperDetailedViewComponent, RouterModule, FormsModule, AsyncPipe, JsonPipe],
	templateUrl: './helper-overview.component.html',
	styleUrl: './helper-overview.component.css'
})
export class HelperOverviewComponent {
	helpers: Helper[] = []

	selectedHelper!: Helper;

	sortBy = "updatedAt"
	searchText = ""
	isAscending = false
	filteredHelpers: Helper[] = []

	filterByJob = "all"

	page = 1
	limit = 5

	helpers$ = this.helperService.helpers$

	typeOfService = TypeOfService

	originalLen!: number

	
	onFilterChange() {
		this.loadHelpers()
	}

	constructor(private helperService: HelperService) {

	}

	ngOnInit(): void {

		this.helpers$.subscribe((data) => {

			if(!this.selectedHelper) {
				this.originalLen = data.length
			}

			if(data.length > 0) {
				this.selectedHelper = data[0]
			}
		})
		
		this.loadHelpers()

	}

	loadHelpers(isFresh = true) {
		
		let params: PaginationParams = {
			page: this.page,
			limit: this.limit,
			sortBy: this.sortBy,
			isAscending: this.isAscending,
			search: this.searchText,
			filterByJob: this.filterByJob
		}

		console.log(`Fetching using params = ${JSON.stringify(params)}`)
		this.helperService.getHelpersPaginated(params).subscribe()
	}


	onHelperSelect(helepr: Helper) {
		// console.log(helepr)
		this.selectedHelper = helepr
	}

	sortHelpers() {
		this.loadHelpers()
	}

	filterHelpers() {
		let filterString = this.searchText.trim().toLowerCase()
		this.loadHelpers()
	}

	downloadHelpers() {
		// const json = JSON.stringify(this.helpers, null, 4)
		// const blob = new Blob([json], { type: "application/json" });

		this.helperService.downloadHelpers().subscribe({
			next: (blob) => {
				const url = URL.createObjectURL(blob)
				const a = document.createElement("a")
				a.href = url;
				a.download = "helpers.csv"
				a.style.display = "none"
				document.body.appendChild(a)
				a.click();
				document.body.removeChild(a)
				URL.revokeObjectURL(url)
			},

			error: (err) => {
				console.error(`Error downloading helpers`)
			}
		})


	}

	reverseList() {
		this.isAscending = !this.isAscending
		this.loadHelpers()
	}
}



/*
import { Component } from '@angular/core';
import { HelperCardComponent } from '../helper-card/helper-card.component';
import { HelperDetailedViewComponent } from '../helper-detailed-view/helper-detailed-view.component';
import { Gender, Helper, TypeOfService, VehicleType, DocumentType } from '../interfaces/helper.interface';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HelperService } from '../services/helper.service';
import { AsyncPipe, JsonPipe } from '@angular/common';


@Component({
	selector: 'app-helper-overview',
	standalone: true,
	imports: [HelperCardComponent, HelperDetailedViewComponent, RouterModule, FormsModule, AsyncPipe, JsonPipe],
	templateUrl: './helper-overview.component.html',
	styleUrl: './helper-overview.component.css'
})
export class HelperOverviewComponent {
	helpers: Helper[] = []

	selectedHelper!: Helper;

	sortBy = "updateTime"
	searchText = ""
	isAscending = false
	filteredHelpers: Helper[] = []

	filterByJob = "all"

	page = 1
	limit = 5

	helpers$ = this.helperService.helpers$
	
	onFilterChange() {
		
		this.loadHelpers()
		return
		
		this.filteredHelpers = this.helpers.filter(h => {
			return this.filterByJob === "all" || h.typeOfService === this.filterByJob
		})
		this.selectedHelper = this.filteredHelpers[0]
	}

	constructor(private helperService: HelperService) {

	}

	ngOnInit(): void {

		// this.helperService.helpers$.subscribe((data) => {
		// 	this.helpers = data
		// 	this.filteredHelpers = this.helpers
			
		// 	this.sortHelpers()
		// 	this.selectedHelper = this.filteredHelpers[0]
		// })

		// this.loadHelpers()

		this.helpers$.subscribe((data) => {
			// this.helpers = data
			// this.filteredHelpers = this.helpers
			this.selectedHelper = data[0]
		})
		
		this.loadHelpers()




	}

	loadHelpers(isFresh = true) {

		this.helperService.getHelpersPaginated({
			page: this.page,
			limit: this.limit,
			sortBy: this.sortBy,
			isAscending: this.isAscending,
			search: this.searchText,
			filterByJob: this.filterByJob
		}).subscribe()
	}


	onHelperSelect(helepr: Helper) {
		console.log(helepr)
		this.selectedHelper = helepr
	}

	sortHelpers() {
		// this.helpers = [...this.helpers].sort((a, b) => a.phone - b.phone)
		// this.helpers = [...this.helpers].sort((a, b) => a.phone.localeCompare(b.phone, undefined, { sensitivity: 'base' }));
		
		
		this.loadHelpers()
		return
		
		if(this.sortBy === "name") {
			this.filteredHelpers = [...this.filteredHelpers].sort((a, b) => a.fullName.localeCompare(b.fullName, undefined, { sensitivity: 'base' }));
		}
		else if(this.sortBy === "employeeId") {
			this.filteredHelpers = [...this.filteredHelpers].sort((a, b) =>   (a.empCode ?? '').localeCompare(b.empCode ?? '', undefined, { sensitivity: 'base' }));
		}
		else if(this.sortBy === "updateTime") {
			this.filteredHelpers = [...this.filteredHelpers].sort((a, b) =>   new Date(a?.updatedAt ?? '').getTime() - new Date(b?.updatedAt ?? '').getTime());
		}
		this.filteredHelpers = this.isAscending ? this.filteredHelpers : [...this.filteredHelpers].reverse()
		this.selectedHelper = this.filteredHelpers[0]
		console.log(this.helpers)
	}

	filterHelpers() {
		let filterString = this.searchText.trim().toLowerCase()
		console.log("Filter helper input changed")
		this.loadHelpers()
		return
		
		// let filterString = this.searchText.trim().toLowerCase()
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
		// const json = JSON.stringify(this.helpers, null, 4)
		// const blob = new Blob([json], { type: "application/json" });

		this.helperService.downloadHelpers().subscribe({
			next: (blob) => {
				const url = URL.createObjectURL(blob)
				const a = document.createElement("a")
				a.href = url;
				a.download = "helpers.csv"
				a.style.display = "none"
				document.body.appendChild(a)
				a.click();
				document.body.removeChild(a)
				URL.revokeObjectURL(url)
			},

			error: (err) => {
				console.error(`Error downloading helpers`)
			}
		})


	}

	reverseList() {
		// this.filteredHelpers = [...this.filteredHelpers].reverse()
		// this.selectedHelper = this.filteredHelpers[0]
		
		this.isAscending = !this.isAscending
		this.loadHelpers()
		return
		
		this.isAscending = !this.isAscending
		this.sortHelpers()
	}
}

*/