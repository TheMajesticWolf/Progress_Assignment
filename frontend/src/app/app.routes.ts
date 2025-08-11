import { Routes } from '@angular/router';
import { NotImplementedComponent } from './not-implemented/not-implemented.component';
import { MainpanelComponent } from './mainpanel/mainpanel.component';
import { HelperAddFormComponent } from './helper-add-form/helper-add-form.component';
import { HelperDetailedViewComponent } from './helper-detailed-view/helper-detailed-view.component';
import { HelperOverviewComponent } from './helper-overview/helper-overview.component';
import { HelperEditFormComponent } from './helper-edit-form/helper-edit-form.component';

export const routes: Routes = [
	{path: "dashboard/staff-management/helpers", component: MainpanelComponent, children: [
		{path: "add-helper", component: HelperAddFormComponent},
		{path: "edit-helper/:_id", component: HelperEditFormComponent},
		{path: "", component: HelperOverviewComponent}
	]},
	// {path: "dashboard/staff-management/helpers/add-helepr", component: HelperAddFormComponent},
	{path: "not-implemented", component: NotImplementedComponent},
	{path: "**", component: NotImplementedComponent},
	
	
];
