const devConfig = {
  port: 8080,
  dbUrl: 'mongodb://localhost:27017/climbing-training-api',
  jwt: {
    privateKey: process.env.PRIVATECL_KEY,
    publicKey: process.env.PUBLICCL_KEY,
    expires: '12h'
  }
}

export default devConfig
