import { Engine } from "../services/engine.service.js"
import { compareHash, hashPassword } from "../services/encrypt.service.js"
import { createAuthCookie } from '../services/cookie.service.js'
import User from "../models/User.js"

class UserController {

  /**
   * Create new User
   * -•-----------•-
   */

  static async create(req, res, next) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm
      } = Engine.getParams([
        'firstName',
        'lastName',
        'email',
        'password',
        'passwordConfirm'
      ])

      if(password !== passwordConfirm) Engine.throw(400, 'Les mots de passes ne correspondent pas')

      if(await User.findOne({ where: { email } })) Engine.throw(400, 'Cet email est déjà utilisé')

      const user = await User.create({
        firstName,
        lastName,
        email,
        password: await hashPassword(password)
      })

      createAuthCookie({ userId: user.id })

      Engine.response(user, 201)
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * Get all Users
   * -•---------•-
   */

  static async getAll(req, res, next) {
    try {
      const users = await User.getAll()

      Engine.response(users)
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * Get one User by ID
   * -•--------------•-
   */

  static async getOne(req, res, next) {
    try {
      const { userId } = Engine.getParams(['userId'])

      const user = await User.getById(userId)

      Engine.response(user)
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * Get current user details
   * -•--------------------•-
   */

  static async getCurrent(req, res, next) {
    try {
      const user = await User.getById(Engine.currentUser.id)
      Engine.response(user)
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * Update User
   * -•-------•-
   * @TODO
   */

  static async update(req, res, next) {
    try {
      const data = Engine.getParams(['firstName', "lastName", "email", "password", "newPassword", "newPasswordConfirm"])

      if(data.newPassword !== data.newPasswordConfirm)
      Engine.throw(400, "Les mots de passe de correspondent pas")

      if(await User.findOne({ where: { email: data.email } }))
      Engine.throw(400, "Ce mail est déjà utilisé")

      const updateData = {}
      if(data.firstName) updateData.firstName = data.firstName
      if(data.lastName) updateData.lastName = data.lastName
      if(data.email) updateData.email = data.email
      if(data.newPassword.length) updateData.password = hashPassword(data.newPassword)

      await User.update(Engine.currentUser.id, updateData)
      const user = await User.getById(Engine.currentUser.id)
      console.log(user.lastName)
      Engine.response(user)
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * Delete User
   * -•-------•-
   * @TODO
   */

  static async delete(req, res, next) {
    try {
      const user = await User.getById(Engine.currentUser.id)

      await user.destroy()
      Engine.response()
    }
    catch(err) {
      next(err)
    }
  }
}

export default UserController