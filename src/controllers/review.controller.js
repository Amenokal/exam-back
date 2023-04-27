import Review from '../models/Review.js'
import { Engine } from '../services/engine.service.js'

class ReviewController {

  /**
   * Create new Review
   * -•-------------•-
   */

     static async create(req, res, next) {
      try {
        const { shopId, text, notes } = Engine.getParams(['shopId', 'text', 'notes'])

        const review = await Review.createWithNotes({ shopId, text, notes })
  
        Engine.response(review, 201)
      }
      catch(err) {
        next(err)
      }
    }
  

  /**
   * Get all Reviews
   * -•-----------•-
   */

   static async getAll(req, res, next) {
    try {
      const reviews = await Review.getAll()
      
      Engine.response(reviews)
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * Get one Review by ID
   * -•----------------•-
   */

  static async getOne(req, res, next) {
    try {
      const { reviewId } = Engine.getParams(['reviewId'])

      const review = await Review.getById(reviewId)

      Engine.response(review)
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * Get User's reviews
   * -•--------------•-
   */

  static async getFrom(req, res, next) {
    try {
      const { userId } = Engine.getParams(['userId'])
      
      const reviews = await Review.getAll({ where: { userId: userId } })

      Engine.response(reviews)
    }
    catch(err) {
      next(err)
    }
  }

  /**
   * Update Review
   * -•---------•-
   */

  static async update(req, res, next) {
    try {
      const { reviewId } = Engine.getParams(['reviewId'])

      await Review.update(reviewId, req.body)
      const review = await Review.getById(reviewId)
      
      Engine.response(review)
    }
    catch(err) {
      next(err)
    }
  }
}

export default ReviewController