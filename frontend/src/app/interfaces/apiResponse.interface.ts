export interface APIResponse<T> {
	success: boolean
	data: T
	error?: any
}
