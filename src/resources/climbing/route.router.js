import { Router } from 'express'
import controllers from './route.controllers'

const router = Router()
// /climbing/route
router
  .route('/')
  .get(controllers.getMany)
  .post(controllers.createOne)
// /climbing/route:id
router
  .route('/:id')
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne)

export default router
