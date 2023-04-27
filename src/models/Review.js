import { Engine } from '../services/engine.service.js'
import Shop from './Shop.js'
import _Model from './_Model.js'

export default class Review extends _Model {

  static async createWithNotes(data) {
    const review = await Review.create({
      userId: Engine.currentUser.id,
      shopId: data.shopId,
      text: data.text,
    })

    for(let i=0; i<data.notes.length; i++) {
      const note = data.notes[i]

      await Review.Note.create({
        reviewId: review.id,
        noteTypeId: note.noteTypeId,
        amount: note.amount
      })
    }

    return await Review.getById(review.id)
  }

  static async getAll(opts) {
    const reviews = await Review.findAll({...opts  ,...Review.options})
    const withAvgNote = []

    for(let i = 0; i < reviews.length; i++) {
      const shop = await Shop.getById(reviews[i].shopId)

      const avg = shop.reviews.map((el) => el.notes.reduce((acc, val) => acc + val.amount, 0) / el.notes.length).reduce((acc, val) => acc + val, 0)

      const shopAvg = (avg / shop.reviews.length).toFixed(1)
      
      withAvgNote.push({
        review: reviews[i],
        avgNote: isNaN(shopAvg) ? "Pas encore noté" : shopAvg
      })
    }

    return withAvgNote
  }

  static async getById(reviewId) {
    return await Review.findByPk(reviewId, Review.options)
  }

}