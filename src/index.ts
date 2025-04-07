import express from 'express';
import connectDB from './config/database';
import swaggerJsDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import { swaggerConfig } from '../swagger.config';
import routes from './routes/index';

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// Rutas
app.use('/', routes);

// Documentación Swagger
const swaggerDocs = swaggerJsDoc(swaggerConfig);
app.use('/swagger', serve, setup(swaggerDocs));

// Conexión a la base de datos y arranque
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
}).catch((error) => {
  console.error('Error al conectar con MongoDB:', error);
  process.exit(1);
});
