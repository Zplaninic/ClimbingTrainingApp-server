import mongoose from 'mongoose'
import options from './../config/index'
import { User } from './../resources/user/user.model'

export const connect = (url = options.dbUrl) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
}

export const getUser = async searchParam => {
  const user = await User.findOne(searchParam)
    .select('email password')
    .exec()

  return user
}
