import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Routes Import
import healthCheckRouter from './routes/healthCheck.routes.js';
import userRouter from './routes/user.routes.js';

// Routes declare
app.use('/api/v1/health', healthCheckRouter);
app.use('/api/v1/users', userRouter);

// error middleware (last)
app.use(errorHandler)

export default app;