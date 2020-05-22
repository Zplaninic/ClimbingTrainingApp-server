import { User } from './../resources/user/user.model'
import jwt from 'jsonwebtoken'
import config from './../config/index'
import { getUser } from './db'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.jwt.privateKey, {
    expiresIn: config.jwt.expires
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.privateKey, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Missing email or password' })
  }
  try {
    const existingUser = await getUser({ email: req.body.email })
    if (existingUser) {
      return res.status(422).json({ errors: { email: 'already taken' } })
    }

    const user = await User.create(req.body)
    const token = newToken(user)

    res.cookie('token', token, { httpOnly: true }).sendStatus(200)
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Need email and password' })
  }
  const invalid = { message: 'Invalid email or password' }
  try {
    const existingUser = await getUser({ email: req.body.email })

    if (!existingUser) {
      return res.status(422).json(invalid)
    }

    const matchPass = await existingUser.comparePassword(req.body.password)

    if (!matchPass) {
      return res.status(422).json(invalid)
    }

    const token = newToken(existingUser)
    return res.cookie('token', token, { httpOnly: true }).sendStatus(200)
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

export const protectApi = async (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).end()
  }

  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    console.error(e)
    return res.status(401).end()
  }

  const user = await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec()
  if (!user) {
    return res.status(401).end()
  }

  req.user = user
  next()
}

export const checkToken = async (req, res) => {
  res.sendStatus(200)
}
