import app from './app';
import connectDB from './config/database';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

const port = process.env.PORT || 3000;
const httpServer = createServer(app);

export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ['GET','POST'],
  },
});

connectDB().then(() => {
  httpServer.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
}).catch((error) => {
  console.error('Error al conectar con MongoDB:', error);
  process.exit(1);
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});
