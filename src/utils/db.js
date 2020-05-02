import mongoose from 'mongoose'
import options from './../config/dev'

export const connect = (url = options.dbUrl) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
}
