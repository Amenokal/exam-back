import _Model from './_Model.js'
import { Op } from "sequelize"

export default class Shop extends _Model {

  static async getAll(opts) {
    const all = await Shop.findAll({...opts, ...Shop.options})
    return all
  }

  static async getById(shopId) {
    return await Shop.findByPk(shopId, Shop.options)
  }

  static async getPodium() {
    const shops = await Shop.getAll()

    const podium = shops
      .map((shop) => {
        if(!shop.reviews.length) return

        const avg = shop.reviews.map((el) => {
          return el.notes.reduce((acc, val) => acc + val.amount, 0) / el.notes.length
        })
        
        const shopAvg = (avg / shop.reviews.length + 1).toFixed(1)
        
        if(isNaN(shopAvg)) return

        return ({
          id: shop.id,
          coords: { lat: shop.lat, lng: shop.lng },
          name: shop.name,
          avgNote: shopAvg
        })
      })
      .sort((a, b) => b.avgNote - a.avgNote)
      .slice(0, 3)

    return podium
  }

  static async search(input, offset) {
    const shops = await Shop.findAll({
      where: { name: { [Op.like]: `%${input}%`}}
    })

    const results = await Shop.findAll({
      where: { name: { [Op.like]: `%${input}%`} },
      limit: 5,
      offset: offset,
    })

    return ({
      results,
      total: shops.length+1,
      pages: Math.ceil((shops.length+1) / 5)
    })
  }
}