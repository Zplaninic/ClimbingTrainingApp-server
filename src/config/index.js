import * as dotenv from 'dotenv'
const env = process.env.NODE_ENV || 'development'

dotenv.config()

const baseConfig = {
  env,
  port: 3000,
  jwt: {
    privateKey: process.env.PRIVATECL_KEY,
    publicKey: process.env.PUBLICCL_KEY,
    expires: '12h'
  }
}

let envConfig = {}

switch (env) {
  case 'development':
    envConfig = require('./dev').config
    break
  case 'test':
    envConfig = require('./testing').config
    break
  default:
    envConfig = require('./dev').config
}

export default Object.assign(baseConfig, envConfig)
