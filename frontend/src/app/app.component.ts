import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidepanelComponent } from './sidepanel/sidepanel.component';
import { MainpanelComponent } from './mainpanel/mainpanel.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, SidepanelComponent, MainpanelComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	title = 'frontend';
}
