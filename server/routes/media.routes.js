import express from 'express';
import path from 'path';
import { ImageService } from '../services/imageService.js';

const router = express.Router();

router.get('/avatars/:imageName', (req, res) => ImageService.processAndSendImage(req, res, 'avatars'));
router.get('/wallpapers/:imageName', (req, res) => ImageService.processAndSendImage(req, res, 'wallpapers'));
router.get('/images/:imageName', (req, res) => ImageService.processAndSendImage(req, res, 'images'));

router.get('/download/images/:imageName', (req, res) => {
    const { imageName } = req.params;
    const imagePath = path.join(process.cwd(), 'public', 'images', imageName);
    res.download(imagePath, imageName, (err) => {
        if (err) {
            console.error(`Error during file download: ${err.message}`);
            res.status(404).send('File not found');
        }
    });
});

router.get('/audio/:fileName', (req, res) => {
    const { fileName } = req.params;
    const audioPath = path.join(process.cwd(), 'public', 'audio', fileName);
    res.sendFile(audioPath);
});

export default router;