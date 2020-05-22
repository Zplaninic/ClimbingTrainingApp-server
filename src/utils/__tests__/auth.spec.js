import { newToken, verifyToken, signup } from '../auth'
import config from '../../config/index'
import jwt from 'jsonwebtoken'
import { User } from '../../resources/user/user.model'

function setup() {
  const req = {
    body: {}
  }
  const res = {}
  const next = jest.fn()
  Object.assign(res, {
    status: jest.fn(
      function status() {
        return this
      }.bind(res)
    ),
    json: jest.fn(
      function json() {
        return this
      }.bind(res)
    ),
    send: jest.fn(
      function send() {
        return this
      }.bind(res)
    ),
    cookie: jest.fn(
      function cookie() {
        return this
      }.bind(res)
    ),
    sendStatus: jest.fn(
      function sendStatus() {
        return this
      }.bind(res)
    )
  })
  return { req, res, next }
}

describe('Authentication', () => {
  describe('newToken', () => {
    test('create new jwt from a user', () => {
      const id = 123456
      const token = newToken({ id })
      const user = jwt.verify(token, config.jwt.privateKey)

      expect(user.id).toBe(id)
    })
  })

  describe('verifyToken', () => {
    test('verify jwt and returns payload', async () => {
      const id = 123456
      const token = newToken({ id })
      const payload = await verifyToken(token)

      expect(payload.id).toBe(id)
    })
  })

  describe('signup', () => {
    test('must have email and password', async () => {
      expect.assertions(4)
      const { req, res } = setup()
      await signup(req, res)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) })
    })

    test('user must be unique', async () => {
      const { req, res } = setup()
      req.body = { email: 'hello@hello.com', password: 'hello12345' }

      await User.create(req.body)
      await signup(req, res)

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({
        errors: { email: expect.any(String) }
      })
    })

    test('recieve data from body and creates user', async () => {
      const { req, res } = setup()
      req.body = { email: 'hello@hello.com', password: 'hello12345' }

      await signup(req, res)

      const user = await User.findOne({ email: req.body.email })
        .select('email password')
        .exec()

      const token = newToken(user)
      expect(res.cookie).toHaveBeenCalledTimes(1)
      expect(res.cookie).toHaveBeenCalledWith('token', token, {
        httpOnly: true
      })
      expect(res.sendStatus).toHaveBeenCalledWith(200)
    })
  })
})
