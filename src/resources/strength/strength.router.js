import { Router } from 'express'
import controllers from './strength.controllers'

const router = Router()
// /strength/exercise
router
  .route('/')
  .get(controllers.getMany)
  .post(controllers.createOne)
// /strength/exercise/:id
router
  .route('/:id')
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne)

export default router
