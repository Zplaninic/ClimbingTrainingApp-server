import { newToken, verifyToken, signup, signin, protectApi } from '../auth'
import config from '../../config/index'
import jwt from 'jsonwebtoken'
import { User } from '../../resources/user/user.model'
import mongoose from 'mongoose'
import { setup } from '../testUtils'

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

  describe('signin', () => {
    test('must have email and password', async () => {
      expect.assertions(4)
      const { req, res } = setup()
      await signin(req, res)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) })
    })

    test('user must exist', async () => {
      expect.assertions(4)
      const { req, res } = setup()
      req.body = { email: 'hello@hello.com', password: 'hello12345' }

      await signin(req, res)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) })
    })

    test('must match password', async () => {
      expect.assertions(4)

      const { req, res } = setup()
      await User.create({
        email: 'hello@hello.com',
        password: 'good-password'
      })

      req.body = { email: 'hello@hello.com', password: 'wrong-password' }

      await signin(req, res)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) })
    })

    test('must create and send token', async () => {
      const { req, res } = setup()
      const userData = {
        email: 'hello@hello.com',
        password: 'oro4039'
      }

      const userFromDb = await User.create(userData)
      req.body = userData

      await signin(req, res)

      const token = newToken(userFromDb)
      expect(res.cookie).toHaveBeenCalledTimes(1)
      expect(res.cookie).toHaveBeenCalledWith('token', token, {
        httpOnly: true
      })
      expect(res.sendStatus).toHaveBeenCalledWith(200)
    })
  })

  describe('protectApi', () => {
    test('must have token inside cookie', async () => {
      const { req, res } = setup()

      req.cookies = {}

      await protectApi(req, res)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.end).toHaveBeenCalledTimes(1)
    })

    test('must recieve payload from token', async () => {
      const { req, res } = setup()

      req.cookies = {
        token: '123456'
      }
      await protectApi(req, res)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.end).toHaveBeenCalledTimes(1)
    })

    test('must have a real user from token', async () => {
      const { req, res } = setup()
      const token = newToken({ id: mongoose.Types.ObjectId() })

      req.cookies = {
        token: token
      }

      await protectApi(req, res)

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.end).toHaveBeenCalledTimes(1)
    })

    test('pass the user wihout password', async () => {
      const { req, res } = setup()
      const user = await User.create({
        email: 'hello@hello.com',
        password: 'good-password'
      })

      const token = newToken(user)

      req.cookies = {
        token: token
      }

      const next = () => {}
      await protectApi(req, res, next)
      expect(req.user._id.toString()).toBe(user._id.toString())
      expect(req.user).not.toHaveProperty('password')
    })
  })
})
