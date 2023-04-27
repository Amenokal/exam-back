import User from "../models/User.js"
import Shop from "../models/Shop.js"
import { Engine } from '../services/engine.service.js'
import { compareHash } from "../services/encrypt.service.js"
import { getJWT } from "../services/jwt.service.js"
import { createAuthCookie, createLogoutCookie, createRefreshedAuthCookie } from '../services/cookie.service.js'

class AuthController {

  static async home(req, res, next) {
    try {
      const users = await User.getAll()
      const shops = await Shop.getAll()
      const data = {
        users: users.length + 1,
        shops: shops.length + 1
      }
      Engine.response(data)
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * User login
   * -•------•-
   */

  static async login(req, res, next) {
    try {
      const { email, password } = Engine.getParams(['email', 'password'])

      const user = await User.findOne({ where: { email } })
      if(!user) Engine.throw(404, "Cet utilisateur n'existe pas")
      
      const validPassword = await compareHash(password, user.password)
      if(!validPassword) Engine.throw(404, "Mauvais mot de passe")
      
      createAuthCookie({ userId: user.id })

      Engine.response(user)
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * Refresh User JWT
   * -•------------•-
   */

  static async refresh(req, res, next) {
    try {
      const { userId } = getJWT()
      const user = await User.getById(userId)

      createRefreshedAuthCookie({ userId: user.id })

      Engine.response(user)
    }
    catch(err) {
      next(err)
    }
  }

  static async logout(req, res, next) {
    try {
      createLogoutCookie()
      
      Engine.response()
    }
    catch(err) {
      next(err)
    }
  }
}

export default AuthController