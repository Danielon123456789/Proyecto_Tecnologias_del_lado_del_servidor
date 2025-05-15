import express from 'express';
import path from 'path';
import hbs from 'hbs';
import connectDB from './config/database';
import swaggerJsDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import { swaggerConfig } from '../swagger.config';
import routes from './routes/index';
import session from 'express-session';
import passport from 'passport';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

const app = express();
const port = process.env.PORT || 3000;
const httpServer = createServer(app);

// Socket.io
export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.json());

// Google auth
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecreto',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Configuración de vistas con Handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos si los tienes
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/', routes);

// RUTA DE PRUEBA PARA VISTA DE PAGO
app.get('/test/pago', (_req, res) => {
  res.render('pago');
});

app.get('/pago-exitoso/:id', (req, res) => {
  res.render('pago-exitoso', { pagoId: req.params.id });
});

app.get('/pago-cancelado/:id', (req, res) => {
  res.render('pago-cancelado', { pagoId: req.params.id });
});

// Swagger
const swaggerDocs = swaggerJsDoc(swaggerConfig);
app.use('/swagger', serve, setup(swaggerDocs));

// Conexión DB
connectDB().then(() => {
  httpServer.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
});
