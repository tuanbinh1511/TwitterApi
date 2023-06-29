import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { uploadFolderPath } from '~/constants/dir'
import { getNameFromFullName, handleUploadSingleImage } from '~/utils/file'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'

config()

class MediaService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newName = getNameFromFullName(file.newFilename)
    const newPath = path.resolve(uploadFolderPath, `${newName}.jpg`)
    await sharp(file.filepath).jpeg().toFile(newPath)
    fs.unlinkSync(file.filepath)
    return isProduction
      ? `${process.env.HOST}/medias/${newName}.jpg`
      : `http:localhost:${process.env.PORT}/medias/${newName}.jpg`
  }
}

const mediaService = new MediaService()
export default mediaService
