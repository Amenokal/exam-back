import { DataTypes } from "sequelize"
import { sequelize } from "./connection.js"
import Review from "../models/Review.js"
import Shop from "../models/Shop.js"
import User from "../models/User.js"


/**
 * Register models
 * -•-----------•-
 */

export function createModels(sequelize) {
  
  /**
   * Sequelize Models
   * -•------------•-
   */
  
  const UserModel = sequelize.define("user", {
    isAdmin:    { type: DataTypes.BOOLEAN,  default: false },
    firstName:  { type: DataTypes.STRING,   allowNull: false},
    lastName:   { type: DataTypes.STRING,   allowNull: false },
    email:      { type: DataTypes.STRING,   allowNull: false },
    password:   { type: DataTypes.STRING,   allowNull: false },
  })
  
  const ShopModel = sequelize.define("shop", {
    name:        { type: DataTypes.STRING,  allowNull: false},
    lat:         { type: DataTypes.FLOAT,   allowNull: false},
    lng:         { type: DataTypes.FLOAT,   allowNull: false},
    city:        { type: DataTypes.STRING },
    departement: { type: DataTypes.INTEGER },
  })
  
  const ReviewModel = sequelize.define("review", {
    text:       { type: DataTypes.TEXT }
  })
  
  const NoteModel = sequelize.define("note", {
    amount:     { type: DataTypes.INTEGER, allowNull: false },
  })
  
  const NoteTypeModel = sequelize.define("noteType", {
    name:       { type: DataTypes.STRING, allowNull: false },
  })
  
  /**
   * Sequelize Relationships
   * -•-------------------•-
   */
  
  UserModel.hasMany(ReviewModel)
  ReviewModel.belongsTo(UserModel)
  
  ShopModel.hasMany(ReviewModel)
  ReviewModel.belongsTo(ShopModel)
  
  ReviewModel.hasMany(NoteModel)
  NoteModel.belongsTo(ReviewModel)
  
  NoteTypeModel.hasMany(NoteModel)
  NoteModel.belongsTo(NoteTypeModel)
  
  /**
   * Default model options
   * -•-----------------•-
   */
  
  const userOptions = {
    include: [{
      model: ReviewModel,
      include: [
        { model: ShopModel },
        { model: NoteModel, include: [ { model: NoteTypeModel } ] }
      ]
    }],
    attributes: [
      'id',
      'email',
      'firstName',
      'lastName',
    ]
  }
  
  const shopOptions = {
    include: [{
      model : ReviewModel,
      include: [
        { model: UserModel, attributes: [ 'id', 'email', 'firstName', 'lastName' ] },
        { model: NoteModel, include: [ { model: NoteTypeModel } ] }
      ]
    }]
  }
  
  const rewiewOptions = {
    include: [
      { model: UserModel, attributes: [ 'id', 'email', 'firstName', 'lastName' ] },
      { model: ShopModel },
      { model: NoteModel, include: [ { model: NoteTypeModel } ] },
    ],
  }
  
  /**
   * Engine setup
   * -•--------•-
   */
  
  User.setModel(UserModel, userOptions)
  Shop.setModel(ShopModel, shopOptions) 
  Review.setModel(ReviewModel, rewiewOptions)
  Review.Note = NoteModel

  return {
    UserModel,
    ShopModel,
    ReviewModel,
    NoteModel,
    NoteTypeModel
  }
}