import User from '../models/User.js'
import { getJWT } from '../services/jwt.service.js'

export class Engine {

  static async setup(req, res, next) {
    try {
      Engine.req = req
      Engine.res = res
      Engine.next = next
      Engine.params = {}
      next()
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * HTTP Traffic
   * -•--------•-
   */

   static async handleAuth(req, res, next) {
    try {
      const { userId } = getJWT()
      const user = await User.getById(userId)
      Engine.currentUser = user
      next()
    }
    catch(err) {
      const authError = new Error("Unauthorized")
      authError.status = 401
      next(authError)
    }
  }
  
  static getParams(params) {
    try {
      const missing = []
      
      params.forEach(key => {        
        if(key in Engine.req.params || key in Engine.req.body) {
          const value = Engine.req.params[key] || Engine.req.body[key]
          Engine.params[key] = value
        }

        else missing.push(key)
      })

      if(missing.length) {
        console.error(`Missing params: ${missing.join(' ')}`)
        Engine.throw(400, "Bad Request")
      }

      return Engine.params
    }
    catch(err) {
      const error = new Error(`Bad request`)
      error.status = 400
      Engine.next(error)
    }
  }

  static response(data) {
    if(!Engine.res.headersSent)
    Engine.res.json(data)
  }

  static throw(status = 500, message = "Server Error") {
    const err = new Error(message)
    err.status = status
    throw err
  }

  /**
   * Middlewares
   * -•-------•-
   */

  static handleError(err, req, res, next) {
    if(err) {
      console.error('\n Caught Error !\n', err.stack, '\n')
      Engine.res.status(err.status || 500).json({ message: err.message || "Server error" })
    }
  }
}