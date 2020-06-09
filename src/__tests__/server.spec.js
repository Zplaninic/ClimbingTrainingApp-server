import request from 'supertest'
import { app } from '../server'
import { User } from '../resources/user/user.model'
import { newToken } from '../utils/auth'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

describe('api authentication', () => {
  app.use(cookieParser())
  let token
  beforeEach(async () => {
    const user = await User.create({
      email: 'hello@hello.com',
      password: 'hello1234'
    })
    token = newToken(user)
  })

  test('api should be closed if no token', async () => {
    let response = await request(app).get('/api/user')
    expect(response.statusCode).toBe(401)

    response = await request(app).get('/api/climbing/route')
    expect(response.statusCode).toBe(401)

    response = await request(app).get('/api/fingerboard/session')
    expect(response.statusCode).toBe(401)

    response = await request(app).get('/api/strength/exercise')
    expect(response.statusCode).toBe(401)

    response = await request(app).get('/api/checkToken')
    expect(response.statusCode).toBe(401)
  })
})
