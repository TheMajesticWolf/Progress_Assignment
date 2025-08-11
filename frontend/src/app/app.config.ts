import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from './services/config-service.service';

let appConfiguration: AppConfig = {
  backendUrl: "http://10.38.45.58",
  port: 6969
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideHttpClient(), {
    provide: APP_CONFIG, useValue: appConfiguration
  }]
};
