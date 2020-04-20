import { User } from './../resources/user/user.model'
import jwt from 'jsonwebtoken'
import config from './../config/dev'

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
    const user = await User.create(req.body)
    const token = newToken(user)

    res.status(200).json({ token })
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
    const user = await User.findOne({ email: req.body.email })
      .select('email password')
      .exec()
    if (!user.email) {
      res.status(401).json(invalid)
    }

    const matchPass = await user.comparePassword(req.body.password)
    if (!matchPass) {
      res.status(401).json(invalid)
    }

    const token = newToken(user)
    return res.status(200).send({ token })
  } catch (e) {
    console.error(e)
    console.log('nesto')
    res.status(500).end()
  }
}

export const protectApi = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).end()
  }

  let token = authHeader.split('Bearer ')[1]
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
