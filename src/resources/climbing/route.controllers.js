import { crudControllers } from './../../utils/crud'
import { connect } from './../../utils/db'
import { Route } from './route.model'

// const rundb = async () => {
//   try {
//     await connect('mongodb://localhost:27017/test')

//     const route = await Route.create({
//       name: 'proba',
//       rest: 50,
//       grade: '6a'
//     })
//     console.log(route)
//   } catch (e) {
//     console.error(e)
//   }
// }

// rundb()
export default crudControllers(Route)
