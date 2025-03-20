import { doubleCsrf, type DoubleCsrfCookieOptions } from 'csrf-csrf'
import * as crypto from '@shardeum-foundation/lib-crypto-utils'
import express, { Request, Response, NextFunction } from 'express'

crypto.init('64f152869ca2d473e4ba64ab53f49ccdb2edae22da192c126850970e788af347')

const csrfSecret = Buffer.from(crypto.randomBytes(32)).toString('hex')
const cookieOptions: DoubleCsrfCookieOptions = {
  maxAge: 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
}

export const { doubleCsrfProtection, generateToken } = doubleCsrf({
  size: 4 * 8,
  getSecret: () => csrfSecret,
  cookieName: 'csrfToken',
  cookieOptions,
})

export const generateTokenHandler = (req: Request, res: Response) => {
  const generatedToken = generateToken(req, res)
  res.set('Content-Type', 'text/plain')
  if (!generatedToken) {
    return res.status(500).send('Cannot generate the requested content.')
  }

  return res.send(generatedToken)
}
