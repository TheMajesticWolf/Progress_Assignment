import { InjectionToken } from '@angular/core';

export interface AppConfig {
	backendUrl: string,
	port: number
}

export const APP_CONFIG = new InjectionToken<AppConfig>("APP_CONFIG")
