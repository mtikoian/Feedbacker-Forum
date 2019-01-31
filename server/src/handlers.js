import logger from './logger'
import { HttpError } from './errors'

/*
  Catch Errors Handler
  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch and errors they throw,
  and pass it along to our express middleware with next()
*/

export function catchErrors(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      await next(error)
    }
  }
}

/*
  Not Found Error Handler
  If we hit a route that is not found,
   we mark it as 404 and pass it along to
   the next error handler to display
*/
export function notFound(req, res, next) {
  const err = new HttpError(404, 'Not Found')
  next(err)
}

/*
  Development Error Hanlder
  log error stack trace
*/
// eslint-disable-next-line no-unused-vars
export function devErr(err, req, res, next) {
  logger.error(err)
  const errorDetails = {
    message: err.message,
    status: err.status,
    stack: err.stack,
  }
  res.status(err.status || 500)
  res.json(errorDetails)
}

/*
  Production Error Handler
  No stacktraces are leaked to user
*/
// eslint-disable-next-line no-unused-vars
export function prodErr(err, req, res, next) {
  logger.error(err)
  res.status(err.status || 500)
  res.json({
    errors: {
      message: err.message,
      error: { },
    },
  })
}