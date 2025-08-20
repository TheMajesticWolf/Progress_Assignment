// src/app/core/http-error.interceptor.ts
import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http'
import { Observable, catchError, throwError } from 'rxjs'
import { Router } from '@angular/router'

@Injectable()
export class HttpErrorHandlerInterceptor implements HttpInterceptor {
	constructor(private router: Router) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		console.log("HTTP interceptor run")
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.status >= 400 && error.status < 600) {
					this.router.navigate(['/error'], {
						queryParams: {
							code: error.status,
							message: error.error.error || error.message,
							statusText: error.statusText
						}
					})
					console.log(`HERE: *******************`)
					console.log(error.message)
					console.log(error.status)
					console.log(`HERE: *******************`)
				}

				return throwError(() => error)
			})
		)
	}
}
