import Sequelize from "sequelize"
import { createModels } from './models.js'
import { seedApp } from './seed.js'

export const sequelize = new Sequelize(
  "mysql://root:@localhost:3306/exam",
  { logging: false }
)

export async function initSequelize() {
  try {
    await sequelize.authenticate()

    const models = createModels(sequelize)

    seedApp(sequelize, models, {
      drop: false,
      sync: false,
      seed: false
    })

    console.log('Database connection has been established successfully.');
  }
  catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}