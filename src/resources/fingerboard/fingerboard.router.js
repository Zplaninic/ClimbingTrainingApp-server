import { Router } from 'express'
import controllers from './fingerboard.controllers'

const router = Router()
// /fingerboard/session
router
  .route('/')
  .get(controllers.getMany)
  .post(controllers.createOne)
// /fingerboard/session/:id
router
  .route('/:id')
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne)

export default router
