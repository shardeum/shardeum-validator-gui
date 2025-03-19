import helmet from 'helmet'
import { Request, Response, NextFunction, Express } from 'express'

export function setSecurityHeaders(app: Express) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          fontSrc: ["'self'"],
          frameAncestors: ["'self'"],
          connectSrc: ["'self'", ...(process.env.RPC_SERVER_URL ? [process.env.RPC_SERVER_URL] : [])],
          upgradeInsecureRequests: [],
        },
      },
      referrerPolicy: { policy: 'strict-origin' },
    })
  )
  app.use(
    helmet.hsts({
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    })
  )
  app.use(helmet.crossOriginOpenerPolicy({ policy: 'same-origin' }))
  app.use(helmet.frameguard({ action: 'sameorigin' }))
  app.use(helmet.noSniff())
  app.use(helmet.xssFilter())
  app.use(helmet.hidePoweredBy())
  app.use((req, res, next) => {
    res.setHeader(
      'Permissions-Policy',
      'accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()'
    )
    next()
  })
}

// Middleware to set Cache-Control header for static files
export function cacheStaticFiles(req: Request, res: Response, next: NextFunction): void {
  // Call the next middleware or route handler
  next()

  // Set caching headers based on the Content-Type header
  const contentType = res.get('Content-Type')
  if (
    contentType &&
    (contentType.startsWith('text/html') ||
      contentType.startsWith('text/css') ||
      contentType.startsWith('application/javascript'))
  ) {
    res.setHeader('Cache-Control', 'public, max-age=86400') // Cache for 1 day
  }
}

export function preventBrowserCacheForDynamicContent(req: Request, res: Response, next: NextFunction) {
  // Call the next middleware or route handler
  next()

  // Set caching headers based on the Content-Type header
  const contentType = res.get('Content-Type')
  if (contentType && contentType.startsWith('application/json')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  }
}
