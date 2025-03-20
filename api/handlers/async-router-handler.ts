import { Request, Response, NextFunction } from 'express'

export function asyncRouteHandler<I, O>(
  handler: (req: Request<I>, res: Response<O>, next: NextFunction) => Promise<void>
) {
  return (req: Request<I>, res: Response<O>, next: NextFunction) => {
    handler(req, res, next).catch(next)
  }
}

export default asyncRouteHandler
