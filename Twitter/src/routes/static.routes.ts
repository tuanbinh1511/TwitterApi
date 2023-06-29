import { Router } from 'express'
import { serveImageController } from '~/controllers/medias.controller'

const staticRoutes = Router()

staticRoutes.get('/image/:name', serveImageController)

export default staticRoutes
