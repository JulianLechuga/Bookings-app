import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import reservationRoutes from './routes/reservationRoutes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Swagger documentation setup
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'SaaS API',
    version: '1.0.0',
    description: 'API documentation for SaaS Starter',
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          '200': {
            description: 'API is running',
          },
        },
      },
    },
  },
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reservations', reservationRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
