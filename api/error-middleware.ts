import fs from 'fs'
import { NextFunction, Request, Response } from 'express'
import path from 'path'

export function errorMiddleware(isDev: boolean) {
  // !!!DO NOT DELETE THE UNUSED NEXT FUNCTION!!! this is required for express to recognize this as an error middleware
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    logError(err.stack) // Log the error stack trace to a file

    if (isDev) {
      res.setHeader('Content-Type', 'application/json')
      res.status(500).json({ message: err.message })
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

const logError = (message: string | undefined) => {
  if (message == null) {
    return
  }
  const timestamp = new Date().toISOString()
  const formattedMessage = `${timestamp} - ERROR: ${message}\n`
  fs.appendFile(path.join(__dirname, '../server_error.log'), formattedMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err)
    }
  })
}
