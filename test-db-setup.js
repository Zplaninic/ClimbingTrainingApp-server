import mongoose from 'mongoose'

beforeEach(async done => {
  const url = 'mongodb://localhost:27017/climbing-training-test'
  async function clearDB() {
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
      await collection.deleteOne()
    }
  }

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      })
      await clearDB()
    } catch (e) {
      console.log('connection error')
      console.error(e)
      throw e
    }
  } else {
    await clearDB()
  }
  done()
})
afterEach(async done => {
  await mongoose.connection.db.dropDatabase()
  await mongoose.disconnect()
  return done()
})
afterAll(done => {
  return done()
})
