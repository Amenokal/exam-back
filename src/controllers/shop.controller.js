import Shop from '../models/Shop.js'
import { Engine } from '../services/engine.service.js'

class ShopController {

  /**
   * Create new Shop
   * -•-----------•-
   */

  static async create(req, res, next) {
    try {
      const { name, lat, lng } = Engine.getParams(['name, lat, lng'])

      const shop = await Shop.create({
        name, 
        lat,
        lng
      })

      Engine.response(shop, 201)
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * Get all Shops
   * -•---------•-
   */

  static async getAll(req, res, next) {
    try {
      const shops = await Shop.getAll()
      
      Engine.response(shops)
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * Get one Shop by ID
   * -•--------------•-
   */

  static async getOne(req, res, next) {
    try {
      const { shopId } = Engine.getParams(['shopId'])

      const shop = await Shop.getById(shopId)

      Engine.response(shop)
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * Get TOP 3 Shops
   * -•-----------•-
   */

  static async getShopPodium(req, res, next) {
    try {
      const shopPodium = await Shop.getPodium()

      Engine.response(shopPodium)
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * Search Shop
   * -•-------•-
   */

  static async search(req, res, next) {
    try {
      const { input, offset } = Engine.getParams(['input', 'offset'])

      const results = await Shop.search(input, offset - 1)

      Engine.response(results)
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * Update Shop
   * -•-------•-
   * @TODO
   */

  static async update(req, res, next) {
    try {
      const { shopId } = Engine.getParams(['shopId'])

      await Shop.update(shopId, req.body)
      const shop = await Shop.getById(shopId)

      Engine.response(shop)
    }
    catch(err) {
      next(err)
    }
  }
}

export default ShopController