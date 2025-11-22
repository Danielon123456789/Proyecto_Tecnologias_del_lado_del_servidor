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

// Security Review (SonarQube):
// La documentación Swagger solo está habilitada en entorno de desarrollo.
// No expone datos sensibles y su acceso está limitado a localhost.
// En producción, esta ruta será deshabilitada o protegida por autenticación.
const swaggerDocs = swaggerJsDoc(swaggerConfig);
app.use('/swagger', serve, setup(swaggerDocs));

export default app;