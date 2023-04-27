import { Engine } from '../services/engine.service.js'
import AuthController from '../controllers/auth.controller.js'
import UserController from '../controllers/user.controller.js'
import ShopController from '../controllers/shop.controller.js'
import ReviewController from '../controllers/review.controller.js'

import express from 'express'
const router = express.Router()

/**
 * API routes
 * -•------•-
 */

// Engine setup middleware
router.use(Engine.setup)

// Authentication
router.get    ('/home', AuthController.home)
router.post   ('/register', UserController.create)
router.post   ('/login', AuthController.login)
router.post   ('/refresh', AuthController.refresh)
router.post   ('/logout', AuthController.logout)

// JWT auth middelware
router.use(Engine.handleAuth)

// User
router.get    ('/users', UserController.getAll)
router.get    ('/users/current/details', UserController.getCurrent)
router.get    ('/users/:userId', UserController.getOne)
router.put    ('/users', UserController.update)
router.delete ('/users', UserController.delete)

// Shop
router.get   ('/shops', ShopController.getAll)
router.get   ('/shops/podium', ShopController.getShopPodium)
router.get   ('/shops/:shopId', ShopController.getOne)
router.post  ('/shops', ShopController.create)
router.post  ('/shops/search', ShopController.search)
router.put   ('/shops', ShopController.update)

// Review
router.get   ('/reviews', ReviewController.getAll)
router.get   ('/reviews/:userId', ReviewController.getFrom)
router.post  ('/reviews', ReviewController.create)
router.put   ('/reviews', ReviewController.update)

// Error handler middelware
router.use(Engine.handleError)

export default router