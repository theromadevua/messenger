import sharp from 'sharp';
import gifsicle from 'gifsicle';
import { promisify } from 'util';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { SUPPORTED_IMAGE_TYPES } from '../utils/constants.js';

const execPromise = promisify(exec);

export class ImageService {
    static async compressImage(imagePath, options = {}) {
        const {
            quality = 100,
            originalSize = false,
            maxWidth = 500,
            size = null
        } = options;

        const extension = path.extname(imagePath).toLowerCase().slice(1);
        
        if (!SUPPORTED_IMAGE_TYPES.includes(extension)) {
            throw new Error('Unsupported image type');
        }

        if (extension === 'gif') {
            return await this.compressGif(imagePath, { quality, size });
        }

        const resizeOptions = originalSize ? null : {
            width: size || maxWidth,
            withoutEnlargement: true,
            fit: 'inside' 
        };

        const imageBuffer = await sharp(imagePath)
            .resize(resizeOptions)
            .jpeg({ quality })
            .toBuffer();

        return { buffer: imageBuffer, contentType: `image/${extension}` };
    }

    static async compressGif(imagePath, options = {}) {
        const { quality = 80, size = null } = options;
        const optimizationLevel = Math.floor((100 - quality) / 20);
        const tempOutputPath = `${imagePath}_compressed.gif`;
        
        try {
            let gifsicleCommand = `gifsicle -O${optimizationLevel}`;
            
            if (size) {
                gifsicleCommand += ` --resize-width ${size}`;
            }
            
            gifsicleCommand += ` "${imagePath}" -o "${tempOutputPath}"`;
            
            await execPromise(gifsicleCommand);
            const buffer = await fs.readFile(tempOutputPath);
            await fs.unlink(tempOutputPath);
            return { buffer, contentType: 'image/gif' };
        } catch (error) {
            throw new Error(`GIF compression failed: ${error.message}`);
        }
    }

    static async processAndSendImage(req, res, folder) {
        const { imageName } = req.params;
        const quality = parseInt(req.query.quality) || 100;
        const originalSize = req.query.originalSize === 'true';
        const size = parseInt(req.query.size) || 500;
        
        const imagePath = path.join(process.cwd(), 'public', folder, imageName);
        
        try {
            const { buffer, contentType } = await this.compressImage(imagePath, {
                quality,
                originalSize,
                size
            });
            
            res.set('Cache-Control', 'public, max-age=31557600');
            res.type(contentType).send(buffer);
        } catch (error) {
            console.error(`Error processing image: ${error.message}`);
            res.status(404).send('Image not found or error during processing');
        }
    }
}