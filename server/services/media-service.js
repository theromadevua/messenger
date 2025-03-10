import fs from 'fs'
import path from 'path';
import * as uuid from 'uuid';
import mime from 'mime';
import { rimraf } from 'rimraf';
import sharp from 'sharp';

class MediaService {
  async deleteFile(filePath) {
    try {
      await rimraf('public/' + filePath); 
      console.log('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
  
  async saveFile(file, folder = 'images') {
    try {
      if (!file || !file.name || !file.data) {
        throw new Error('Invalid file object');
      }
  
      const mimeType = file.mimetype || 'application/octet-stream';
      const fileExtension = path.extname(file.name) || `.${mime.getExtension(mimeType)}`;
      const fileName = `${uuid.v4()}${fileExtension}`;
      const fullFolderPath = path.join(process.cwd(), 'public', folder);
      const fullFilePath = path.join(fullFolderPath, fileName);
  
      if (!fs.existsSync(fullFolderPath)) {
        fs.mkdirSync(fullFolderPath, { recursive: true });
      }
  
        const metadata = await sharp(file.data).metadata();
        
        await fs.promises.writeFile(fullFilePath, file.data);
  
        return {
          url: `${folder}/${fileName}`,
          width: metadata.width,
          height: metadata.height,
          aspectRatio: metadata.width / metadata.height
        };
  
      
      // await fs.promises.writeFile(fullFilePath, file.data);
      // return {
      //   url: `${folder}/${fileName}`
      // };
    } catch (error) {
      throw error;
    }
  }

  saveBase64Audio(base64Data, folder = 'audio') {
    return new Promise((resolve, reject) => {
      try {
        const buffer = Buffer.from(base64Data.split(',')[1], 'base64');
        const fileName = `${uuid.v4()}.wav`;
        
        const fullFolderPath = path.join(process.cwd(), 'public/' + folder);
        
        if (!fs.existsSync(fullFolderPath)) {
          fs.mkdirSync(fullFolderPath, { recursive: true });
        }

        const fullFilePath = path.join(fullFolderPath, fileName);
        
        fs.writeFile(fullFilePath, buffer, (err) => {
          if (err) {
            reject(err);
          } else {
            const fileUrl = `${folder}/${fileName}`;
            resolve(fileUrl);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new MediaService();