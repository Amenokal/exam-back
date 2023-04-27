import jwt from 'jsonwebtoken'
import { Engine } from './engine.service.js'
import { getCookie } from './cookie.service.js'

export function createJWT(data) {
  return jwt.sign(
    data,
    process.env.JWT_SECRET,
    { expiresIn: '1h' }  
  )
}

export function getJWT() {
  const cookie = getCookie()

  return jwt.verify(
    cookie.jwt,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if(err) Engine.throw(401, "Unauthorized")
      else return decoded
    }
  )
}