// src/app.ts
import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import { swaggerConfig } from './swagger.config';
import routes from './routes/index';

// Crear la aplicación Express
const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use('/', routes);

// Documentación Swagger
const swaggerDocs = swaggerJsDoc(swaggerConfig);
app.use('/swagger', serve, setup(swaggerDocs));

export default app;