import _Model from './_Model.js'

export default class User extends _Model {

  static async getAll() {
    return await User.findAll(User.options)
  }

  static async getById(userId) {
    return await User.findByPk(userId, User.options)
  }

}