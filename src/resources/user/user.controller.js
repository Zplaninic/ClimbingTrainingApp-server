import User from './user.model'

export const me = (req, res) => {
  res.status(200).json({ data: req.user })
}
