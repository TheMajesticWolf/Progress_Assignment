import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Helper } from '../interfaces/helper.interface';
import { APIResponse } from '../interfaces/apiResponse.interface';
import { APP_CONFIG, AppConfig } from '../services/config-service.service';
import { appConfig } from '../app.config';
import { PaginationParams } from '../interfaces/paginationParams.interface';


@Injectable({
	providedIn: 'root'
})
export class HelperService {

	// BACKEND = "http://localhost:6969/api/db"
	// BACKEND = "http://10.38.45.58:6969/api/db"

	helpersSubject = new BehaviorSubject<Helper[]>([])
	helpers$ = this.helpersSubject.asObservable()

	constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) {
		// this.getHelpers().subscribe()
		// this.getHelpersPaginated({limit: 10, page: 1} as PaginationParams).subscribe()
	}

	BACKEND = `${this.appConfig.backendUrl}:${this.appConfig.port}/api/db`


	getHelpers(): Observable<Helper[]> {
		return this.http.get<APIResponse<Helper[]>>(`${this.BACKEND}/helpers`)
			.pipe(
				map(response => {console.log(`Here in service: ${JSON.stringify(response, null, 4)}`); return response.data}),
				tap(helpers => this.helpersSubject.next(helpers))
			)
	}

	getHelperById(_id: string): Observable<APIResponse<Helper>> {
		return this.http.get<APIResponse<Helper>>(`${this.BACKEND}/helpers/${_id}`)
			.pipe(map(response => response))
	}

	addHelper(formData: FormData): Observable<APIResponse<Helper>> {
		// let payload = this.transformFormData(formData)

		return this.http.post<APIResponse<Helper>>(`${this.BACKEND}/helpers`, formData)
			.pipe(
				map(response => response),
				tap(newHelper => {
					const updated = [...this.helpersSubject.value, newHelper.data]
					this.helpersSubject.next(updated)
				})
			)
	}

	updateHelper(_id: string, formData: FormData): Observable<APIResponse<Helper>> {
		// let payload = this.transformFormData(formData)

		return this.http.put<APIResponse<Helper>>(`${this.BACKEND}/helpers/${_id}`, formData)
			.pipe(
				map(response => response),
				tap(updatedHelper => {
					let updated = this.helpersSubject.value.map(h => h._id === _id ? updatedHelper.data : h)
					this.helpersSubject.next(updated)
				})
			)
	}

	deleteHelperById(_id: string): Observable<APIResponse<Helper>> {
		return this.http.delete<APIResponse<Helper>>(`${this.BACKEND}/helpers/${_id}`)
			.pipe(
				map(response => response),
				tap(deleted => {
					console.log(`Deleted is: ${JSON.stringify(deleted, null, 4)}`)
					let filtered = this.helpersSubject.value.filter(h => h._id !== deleted.data._id)
					// console.log(`The filtered list is: ${JSON.stringify(filtered, null, 4)}`)
					this.helpersSubject.next(filtered)
				})
			)
	}

	transformFormData(formData: any): Partial<Helper> {
		let step0 = formData?.step_0
		let step1 = formData?.step_1

		return {
			typeOfService: step0?.typeOfService,
			organisationName: step0?.organisationName,
			fullName: step0?.fullName,
			photoUrl: step0?.photoUrl,
			languages: step0?.languages,
			gender: step0?.gender,
			phone: step0?.phone,
			email: step0?.email,
			vehicleType: step0?.vehicleType,
			vehicleNumber: step0?.vehicleNumber,
			kycDetails: {
				document: step0?.kycDetails?.document,
				documentType: step0?.kycDetails?.documentType
			},
			additionalDocs: step1?.additionalDocs
		}
	}

	uploadProfilePic(formData: FormData) {

		return this.http.post<APIResponse<string>>(`${this.BACKEND}/uploads/upload-profile-pic`, formData)

	}

	uploadKYCDoc(formData: FormData) {
		return this.http.post<APIResponse<string>>(`${this.BACKEND}/uploads/upload-kyc-doc`, formData)
	}

	uploadAdditionalDoc(formData: FormData) {
		return this.http.post<APIResponse<string>>(`${this.BACKEND}/uploads/upload-additional-doc`, formData)
	}

	downloadHelpers() {
		return this.http.get(`${this.BACKEND}/helpers/download`, {
			responseType: "blob"
		})
	}

	getHelpersPaginated(queryParams: PaginationParams, toAppend: boolean): Observable<Helper[]> {

		let params = new HttpParams()
		params = (queryParams.search && params.append("search", queryParams.search)) || params
		params = (queryParams.filterByJob && params.append("filterByJob", queryParams.filterByJob)) || params
		params = (queryParams.sortBy && params.append("sortBy", queryParams.sortBy)) || params
		params = (queryParams.isAscending != null && params.append("isAscending", queryParams.isAscending)) || params
		params = (queryParams.page && params.append("page", queryParams.page)) || params
		params = (queryParams.limit && params.append("limit", queryParams.limit)) || params
		
		return this.http.get<APIResponse<Helper[]>>(`${this.BACKEND}/helpers/paginated`, {
			params: params
		})
			.pipe(
				map(response => {return response.data}),
				tap(helpers => {
					// this.helpersSubject.next(helpers)
					let initial = this.helpersSubject.value
					if(toAppend) {
						this.helpersSubject.next([...initial, ...helpers])
					}
					else {
						this.helpersSubject.next(helpers)
					}
				})
			)
	}

	convertImageUrlToBase64(url: string): Promise<string> {
		return fetch(url)
			.then(res => res.blob())
			.then(blob => new Promise((resolve, reject) => {
				const reader = new FileReader()
				reader.onloadend = () => resolve(reader.result as string)
				reader.onerror = () => reject()
				reader.readAsDataURL(blob)
			}))
	}
}





// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, map, Observable } from 'rxjs';
// import { Helper, TypeOfService } from '../interfaces/helper.interface';

// interface APIResponse<T> {
// 	success: boolean
// 	data: T
// 	error?: any
// }


// @Injectable({
// 	providedIn: 'root'
// })
// export class HelperService {

// 	helpersSubject = new BehaviorSubject<Helper[]>([])

// 	helpers$: Observable<Helper[]> = this.helpersSubject.asObservable()

// 	constructor(private http: HttpClient) {
// 		this.getHelpers()
// 	}

// 	BACKEND = "http://localhost:6969/api/db"

// 	getHelpers() {
		
// 		return this.http.get<APIResponse<Helper[]>>(`${this.BACKEND}/helpers`)
// 		.subscribe({
// 			next: (data) => {
// 				this.helpersSubject.next(data.data)
// 			},
// 			error: (err) => {
// 				console.error(`Error occured at GET /helpers: ${(err as Error).message}`)
// 			}
// 		})
// 	}
	
	
// 	getHelperById(_id: string) {
// 		console.log(`\t_id=${_id}`)
// 		return this.http.get<APIResponse<Helper>>(`${this.BACKEND}/helpers/${_id}`)
// 		.pipe(
// 			map(response => response.data)
// 		)

// 	}
	

// 	deleteHelperById(_id: string) {
// 		console.log("Orig: ")
// 		console.log(this.helpersSubject.value)
// 		this.http.delete<APIResponse<Helper>>(`${this.BACKEND}/helpers/${_id}`)
// 		.subscribe({
// 			next: (response) => {
// 				let updatedList = this.helpersSubject.value.filter((ele) => ele._id != response.data._id)
// 				console.log("UPDATED LIST")
// 				console.log(updatedList)
// 				this.helpersSubject.next(updatedList)
// 			},

// 			error: (err) => {
// 				console.error(`Error occured at DELETE /helpers: ${(err as Error).message}`)
// 			}

// 		})
// 	}

// 	addHelper(formData: any) {
// 		let a = {
// 			"typeOfService": "Driver",
// 			"organisationName": "Anderson PLC",
// 			"fullName": "Test1",
// 			"languages": [
// 			"Hindi",
// 			"Bengali",
// 			"English"
// 			],
// 			"gender": "Male",
// 			"phone": "9600596043",
// 			"email": "test@test.com",
// 			"vehicleType": "Auto",
// 			"vehicleNumber": "",
// 			"kycDetails": {
// 			"documentType": "Aadhaar",
// 			"document": "1234-4155-4657"
// 			}
// 		}

// 		let step0 = formData?.step_0
// 		let step1 = formData?.step_1



// 		let backendAcceptedFormat = {
// 			typeOfService: step0?.typeOfService,
// 			organisationName: step0?.organisationName,
// 			fullName: step0?.fullName,
// 			// photoUrl: step0?.photoUrl,
// 			languages: step0?.languages,
// 			gender: step0?.gender,
// 			phone: step0?.phone,
// 			email: step0?.email,
// 			vehicleType: step0?.vehicleType,
// 			vehicleNumber: step0?.vehicleNumber,
// 			kycDetails: {
// 				document: step0?.kycDetails.document,
// 				documentType: step0?.kycDetails.documentType
// 			}
			
// 		}

// 		this.http.post<APIResponse<Helper>>(`${this.BACKEND}/helpers`, backendAcceptedFormat).subscribe({
// 			next: (response) => {
				
// 				let newlyAdded = response.data
// 				let updatedList = [...this.helpersSubject.value, newlyAdded]
// 				this.helpersSubject.next(updatedList)
				
// 			},

// 			error: (err) => {
// 				console.error(`Error occured at POST /helpers: ${(err as Error).message}`)
// 			}
// 		})
// 	}

// 	updateHelper(_id: string, formData: any) {
// 		let a = {
// 			"typeOfService": "Driver",
// 			"organisationName": "Anderson PLC",
// 			"fullName": "Test1",
// 			"languages": [
// 			"Hindi",
// 			"Bengali",
// 			"English"
// 			],
// 			"gender": "Male",
// 			"phone": "9600596043",
// 			"email": "test@test.com",
// 			"vehicleType": "Auto",
// 			"vehicleNumber": "",
// 			"kycDetails": {
// 			"documentType": "Aadhaar",
// 			"document": "1234-4155-4657"
// 			}
// 		}

// 		let step0 = formData?.step_0
// 		let step1 = formData?.step_1



// 		let backendAcceptedFormat = {
// 			typeOfService: step0?.typeOfService,
// 			organisationName: step0?.organisationName,
// 			fullName: step0?.fullName,
// 			// photoUrl: step0?.photoUrl,
// 			languages: step0?.languages,
// 			gender: step0?.gender,
// 			phone: step0?.phone,
// 			email: step0?.email,
// 			vehicleType: step0?.vehicleType,
// 			vehicleNumber: step0?.vehicleNumber,
// 			kycDetails: {
// 				document: step0?.kycDetails.document,
// 				documentType: step0?.kycDetails.documentType
// 			}
			
// 		}

// 		this.http.put<APIResponse<Helper>>(`${this.BACKEND}/helpers/${_id}`, backendAcceptedFormat).subscribe({
// 			next: (response) => {
				
// 				let newlyAdded = response.data
// 				let updatedList = this.helpersSubject.value.map((ele) => {
// 					return ele._id == _id ? newlyAdded : ele
// 				})
// 				this.helpersSubject.next(updatedList)
				
// 			},

// 			error: (err) => {
// 				console.error(`Error occured at POST /helpers: ${(err as Error).message}`)
// 			}
// 		})
// 	}
	
// }
