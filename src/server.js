import express from 'express'
import config from './config/dev'
import { json, urlencoded } from 'body-parser'
import { connect } from './utils/db'
import { signup, signin, protectApi } from './utils/auth'
import climbingRouteRouter from './resources/climbing/route.router'
import fingerBoardRouter from './resources/fingerboard/fingerboard.router'
import userRouter from './resources/user/user.router'
import cookieParser from 'cookie-parser'

export const app = express()
export const setResponseHeaders = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000') // mozda promijenim samo za moj server
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
}

app.disable('x-powered-by')

app.use(json())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))
app.use(setResponseHeaders)

app.post('/api/signup', signup)
app.post('/api/signin', signin)

app.use('/api', protectApi)
app.use('/api/user', userRouter)
app.use('/api/climbing/route', climbingRouteRouter)
app.use('/api/fingerboard/session', fingerBoardRouter)

export const start = async () => {
  try {
    await connect()
    app.listen(config.port, () =>
      console.log(
        `Climbing app server listening at http://localhost:${config.port}`
      )
    )
  } catch (e) {
    console.error(e)
  }
}
