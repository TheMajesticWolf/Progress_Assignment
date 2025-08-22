import type { Request, Response, NextFunction } from 'express'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(`[ERROR]: ${err.message}`)

	res.status(500).json({
		success: false,
		message: err.message ? err.message : 'Unknown server Error',
		fromErrorHandler: true
	})
}
