import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controller'
import { wrapAsync } from '~/utils/handlers'
const mediasRouter = Router()

mediasRouter.post('/upload-image', uploadSingleImageController)

export default mediasRouter
