import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import router from './src/routes/index.js'
import { initSequelize } from './src/database/connection.js'

dotenv.config()

const CORS_OPTIONS = { origin: "http://localhost:3000", credentials: true }
const BODY_PARSER_OPTIONS = { extended: false }

const app = express()

app.use(helmet())
app.use(cors(CORS_OPTIONS))
app.use(cookieParser())
app.use(bodyParser.urlencoded(BODY_PARSER_OPTIONS))
app.use(bodyParser.json())
app.use(router)
initSequelize()
app.listen(process.env.PORT, () => {
  console.log('App ready & listening on port', process.env.PORT)
})

