import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();
const configuredCorsOrigin = process.env.CORS_ORIGIN?.trim();
const resolvedCorsOrigin =
  !configuredCorsOrigin || configuredCorsOrigin === '*'
    ? true
    : configuredCorsOrigin
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

app.use(cors({
  origin: resolvedCorsOrigin,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Routes Import
import healthCheckRouter from './routes/healthCheck.routes.js';
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';
import teacherRouter from './routes/teacher.routes.js';
import studentRouter from './routes/student.routes.js';

// Routes declare
app.use('/api/v1/health', healthCheckRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/teacher', teacherRouter);
app.use('/api/v1/student', studentRouter);

// error middleware (last)
app.use(errorHandler)

export default app;