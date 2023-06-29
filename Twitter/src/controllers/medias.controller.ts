import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { uploadFolderPath } from '~/constants/dir'
import mediaService from '~/services/media.services'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediaService.uploadImage(req)
  return res.json({
    messageL: 'Upload successfully',
    result
  })
}

export const serveImageController = async (req: Request, res: Response) => {
  const { name } = req.params
  console.log(name)
  return res.sendFile(path.resolve(uploadFolderPath, name), (err) => {
    console.log(err)
    if (err) {
      res.status((err as any).status).json({
        message: 'Not found'
      })
    }
  })
}
