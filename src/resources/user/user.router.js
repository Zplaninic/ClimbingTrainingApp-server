import { Router } from 'express'
import { me } from './user.controller'

const router = Router()

router.get('/', me)

export default router
