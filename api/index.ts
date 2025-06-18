import apiRouter from './api'
import { apiLimiter, httpBodyLimiter, jwtMiddleware, loginAttemptLimiter, loginHandler, logoutHandler } from './auth'
import * as https from 'https'
import * as fs from 'fs'
import path from 'path'
import express from 'express'
import next from 'next'
import dotenv from 'dotenv'
import { cacheStaticFiles, preventBrowserCacheForDynamicContent, setSecurityHeaders } from './security-headers'
import { errorMiddleware } from './error-middleware'
import { nodeVersionHandler } from './handlers/node'
import { generateTokenHandler } from './csrf'

dotenv.config()
const port = process.env.PORT ? +process.env.PORT : 8081
const isDev = process.env.NODE_ENV === 'development'
const cookieParser = require('cookie-parser')

if (isDev) {
  const nextApp = next({ dev: isDev, port })
  const nextHandler = nextApp.getRequestHandler()
  nextApp.prepare().then(() => {
    const app = express()
    app.use(httpBodyLimiter)
    app.use(apiLimiter)
    app.use(cookieParser())
    app.use(preventBrowserCacheForDynamicContent)
    app.get('/csrf-token', generateTokenHandler)
    app.post('/auth/login', loginAttemptLimiter, loginHandler)
    app.post('/auth/logout', logoutHandler)
    app.use('/api', jwtMiddleware, apiRouter)
    app.get('/node/version', nodeVersionHandler)
    app.get('*', (req: any, res: any) => nextHandler(req, res))
    app.use(errorMiddleware(isDev))

    app.listen(port, () => {
      console.log(`STARTED SERVER IN DEVELOPMENT MODE`)
      console.log(`server started at http://localhost:${port}`)
    })
  })
} else {
  const app = express()
  app.use(httpBodyLimiter)
  app.use(apiLimiter)
  app.use(cookieParser())
  setSecurityHeaders(app)
  app.use(preventBrowserCacheForDynamicContent)
  app.get('/csrf-token', generateTokenHandler)
  app.post('/auth/login', loginAttemptLimiter, loginHandler)
  app.post('/auth/logout', logoutHandler)
  app.use('/api', jwtMiddleware, apiRouter)
  app.get('/node/version', nodeVersionHandler)
  app.use(errorMiddleware(isDev))
  app.use(cacheStaticFiles)
  app.use(express.static(path.join(__dirname, '..', 'out'), { extensions: ['html'] }))
  const privateKey = fs.readFileSync(path.join(__dirname, '../selfsigned.key'), 'utf8')
  const certificate = fs.readFileSync(path.join(__dirname, '../selfsigned.crt'), 'utf8')
  const credentials = { key: privateKey, cert: certificate }

  https.createServer(credentials, app).listen(port, () => {
    console.log(`STARTED SERVER IN PRODUCTION MODE`)
    console.log(`server started at https://localhost:${port}`)
  })
}
