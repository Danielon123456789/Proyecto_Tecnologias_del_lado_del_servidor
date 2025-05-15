import app from './app'; // Importa la app desde el nuevo archivo
import connectDB from './config/database';
import { createServer } from 'http';
import { Server as SocketIOServer} from 'socket.io';

const port = process.env.PORT || 3000;

// Servidor HTTP manualmente
const httpServer = createServer(app);

export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ['GET','POST'],
  },
});

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

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});