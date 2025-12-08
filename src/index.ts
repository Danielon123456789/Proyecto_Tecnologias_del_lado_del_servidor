import express from 'express';
import connectDB from './config/database';
import swaggerJsDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import { swaggerConfig } from '../swagger.config';
import path from 'path'
import { engine } from 'express-handlebars'
import {join} from 'path'
import routes from './routes/index';
import { createServer } from 'http';
import { Server as SocketIOServer} from 'socket.io';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';




const app = express();
const port = process.env.PORT || 5000;

//Servidor HTTP manualmente
const httpServer = createServer(app);

export const io = new SocketIOServer(httpServer,{
  cors:{
    origin: "*",
    methods: ['GET','POST'],
  },
})

app.use(cors({
  origin: '*', // Permite todas las solicitudes, ajusta según tu dominio de frontend
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Permite el encabezado Authorization
}));

// Middlewares
app.use(express.json());

app.use(express.static(path.join(__dirname,'public')))

// handlebars vistas
app.engine('.handlebars', engine({ extname: '.handlebars' }));
app.set('view engine', '.handlebars');
app.set('views', join(__dirname, 'views')); // Ruta absoluta


// google auth
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecreto',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('',(req,res)=>{
    res.send('OK')
})

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

// Manejar eventos de socket.io
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  socket.on('newOrder', (orden) => {
    console.log('Nueva orden recibida:', orden._id);
    // Emitir a todos los clientes conectados
    io.emit('newOrder', orden);
  });
});

