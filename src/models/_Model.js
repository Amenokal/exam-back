export default class _Model {

  static setModel(model, options) {
    this.model = model
    this.options = options
  }

  // -•-----------------------------------•-
  
  static async findAll(opts) {
    return await this.model.findAll(opts)
  }

  static async findByPk(id, opts) {
    return await this.model.findByPk(id, opts)
  }

  static async findOne(opts) {
    return await this.model.findOne(opts)
  }

  static async create(data) {
    return await this.model.create(data)
  }

  static async update(id, data) {
    await this.model.update(data, { where: { id } })
    return await this.model.findByPk(id, this.options)
  }

  static async delete(id) {
    const target = await this.model.findByPk(id)
    return await target.destroy()
  }
}