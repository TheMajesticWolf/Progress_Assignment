import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
	selector: 'app-sidepanel',
	standalone: true,
	imports: [RouterLink, RouterModule, CommonModule],
	templateUrl: './sidepanel.component.html',
	styleUrl: './sidepanel.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidepanelComponent implements OnInit {

	services: any = [
		{
			expanded: false,
			category: "Resident Management",
			children: [
				{
					label: "Flats",
					path: "dashboard/resident-management/flats"
				},
				{
					label: "Helpdesk Setup",
					path: "dashboard/resident-management/helpdesk-setup"
				},
				{
					label: "Helpdesk Tickets",
					path: "dashboard/resident-management/helpdesk-tickets"
				},
				{
					label: "Amenities",
					path: "dashboard/resident-management/amenities"
				},
				{
					label: "Renovation Works",
					path: "dashboard/resident-management/renovation-works"
				},
				{
					label: "Violation Setup",
					path: "dashboard/resident-management/violation-setup"
				},
				{
					label: "Violation Tickets",
					path: "dashboard/resident-management/violation-tickets"
				},
			]
		},
		{
			expanded: true,
			category: "Staff Management",
			children: [
				{
					label: "Roles & Deptartments",
					path: "dashboard/staff-management/roles-departments"
				},
				{
					label: "Staff Directory",
					path: "dashboard/staff-management/staff-directory"
				},
				{
					label: "Helpers",
					path: "dashboard/staff-management/helpers"
				},
			]
		},
		{
			expanded: false,
			category: "Work Management",
			children: [
				{
					label: "Assets",
					path: "dashboard/work-management/assets"
				},
				{
					label: "Locations",
					path: "dashboard/work-management/locations"
				},
				{
					label: "Work Packages",
					path: "dashboard/work-management/work-packages"
				},
				{
					label: "Work Scheduler",
					path: "dashboard/work-management/work-scheduler"
				},
				{
					label: "Work Logs",
					path: "dashboard/work-management/work-logs"
				},
				{
					label: "Issues",
					path: "dashboard/work-management/issues"
				},
			]
		},
	]

	filteredServices: any = []

	constructor(private router: Router) {

	}

	ngOnInit(): void {
		this.filteredServices = [...this.services]
		// this.isActive(this.router.url)		
	}

	toggleExpand(index: number) {
		this.filteredServices = this.filteredServices.map((ele: any, idx: any) => (
			idx == index ? {...ele, expanded: !ele.expanded} : ele
		))
	}

	handleChange(event: Event) {
		let e = (event.target as HTMLInputElement)
		console.log(e.value)
		this.filteredServices = this.services.filter((ele: any) => {

			let flag = false;

			if(ele.category.toLowerCase().includes(e.value.toLowerCase())) {
				flag = true;
			}


			for(let child of ele.children) {
				if(child.label.toLowerCase().includes(e.value.toLowerCase())) {
					flag = true;
					// break
				}
			}
			
			return flag;

		})

		this.filteredServices = this.filteredServices.map((ele: any) => {
			return {
				...ele,
				expanded: true
			}
		})

		if(this.filteredServices.length > 0) {
			// this.router.navigateByUrl(this.filteredServices[0].children[0].path)

		}
	}

	// isActive(path: string) {
	// 	console.log(path)
	// 	console.log(this.router.url)
	// 	return this.router.url.includes(path)
	// }

}
