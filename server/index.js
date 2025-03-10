import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors.js';
// import { setupPaths } from './utils/paths.js';
import router from './routes/index.js';
import mediaRoutes from './routes/media.routes.js';
import setupSocket from './socketServer.js';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

// const { __dirname } = setupPaths();

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.use(cookieParser());
app.use(express.json());
app.use(fileUpload());
app.use(cors(corsOptions));

app.use('/api', router);
app.use('/', mediaRoutes);
app.use('/public', express.static(path.join(__dirname, 'public')));

// app.use(authMiddleware);
// app.use(errorMiddleware);

const server = http.createServer(app);
setupSocket(server);

const startServer = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        server.listen(PORT, HOST, () => {
            console.log(`Server running on http://${HOST}:${PORT}`);
        });
    } catch (error) {
        console.error(`Error starting the server: ${error.message}`);
    }
};

startServer();