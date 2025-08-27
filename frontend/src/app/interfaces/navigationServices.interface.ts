export interface NavigationServiceInterface {
	expanded: boolean
	category: string
	children: {
			label: string
			path: string
		} []
	
}