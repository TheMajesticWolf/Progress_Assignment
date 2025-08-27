import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from './services/config-service.service';
import { HttpErrorHandlerInterceptor } from './interceptors/http-error-handler/http-error-handler.interceptor';

let appConfiguration: AppConfig = {
	backendUrl: "http://10.164.248.58",
	port: 6969
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideAnimationsAsync(),
		provideHttpClient(withInterceptorsFromDi()),
		{
			provide: APP_CONFIG, 
			useValue: appConfiguration
		},

		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpErrorHandlerInterceptor,
			multi: true
		}
	]
};
