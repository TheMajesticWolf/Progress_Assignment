import type { Helper } from "./helper.interface.js"

export interface APIResponse {
	success: boolean
	data: string | Partial<Helper> | Partial<Helper>[]
	len?: number
	error?: string
}