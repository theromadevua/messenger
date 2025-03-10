export const corsOptions = {
    credentials: true,
    origin: [
        process.env.API_URL,
        process.env.CLIENT_URL,
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};