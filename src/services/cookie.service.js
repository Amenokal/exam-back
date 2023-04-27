import { Engine } from './engine.service.js'
import { createJWT } from './jwt.service.js'

export function getCookie() {
  try {
    return Engine.req.cookies[process.env.COOKIE_NAME]
  }
  catch(err) {
    Engine.next(err)
  }
}

function setCookie(token, time) {
  Engine.res.cookie(
    process.env.COOKIE_NAME,
    { jwt: token },
    { maxAge: time, httpOnly: true, sameSite: 'lax' }
  )
}

export function createAuthCookie(data) {
  const token = createJWT(data)
  setCookie(token, 1000 * 60 * 60)
}

export function createRefreshedAuthCookie(data) {
  const token = createJWT(data)
  setCookie(token, 1000 * 60 * 60)
}

export function createLogoutCookie() {
  setCookie(null, 0)
}