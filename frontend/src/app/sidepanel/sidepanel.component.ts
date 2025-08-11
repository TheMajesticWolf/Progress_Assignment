import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
	selector: 'app-sidepanel',
	standalone: true,
	imports: [RouterLink, RouterModule],
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

	constructor(private router: Router) {

	}

	ngOnInit(): void {
		
	}

	toggleExpand(index: number) {
		this.services = this.services.map((ele: any, idx: any) => (
			idx == index ? {...ele, expanded: !ele.expanded} : ele
		))
	}

}
