import { Request, Response } from 'express'

export function badRequestResponse(res: Response, msg: string) {
  console.log(`ERROR HTTP 400: ${msg}`)
  res.status(400).json({
    errorMessage: msg,
  })
  res.end()
}

export function cliStderrResponse(res: Response, msg: string, details: string | undefined) {
  console.log(`ERROR HTTP 400: ${msg}`)
  res.status(400).json({
    errorMessage: msg,
    errorDetails: details,
  })
  res.end()
}

export function unautorizedResponse(req: Request, res: Response) {
  res.status(403).json({
    errorMessage: 'unauthorized',
  })
  console.log(`ERROR HTTP 403: ${req.url}`)
}

export function notFoundResponse(res: Response, msg: string) {
  console.log(`ERROR HTTP 404: ${msg}`)
  res.status(404).json({
    errorMessage: 'not found',
  })
}

export const fetchWithTimeout = (url: string, options: RequestInit, timeout = 5000): any => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timed out'))
    }, timeout)

    fetch(url, options)
      .then(response => {
        clearTimeout(timer)
        resolve(response)
      })
      .catch(err => {
        clearTimeout(timer)
        reject(err)
      })
  })
}
