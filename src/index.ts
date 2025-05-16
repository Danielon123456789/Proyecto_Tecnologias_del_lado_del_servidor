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

// Almacenar las conexiones de usuario (ID de usuario -> ID de socket)
const userConnections = new Map<string, string>();

// Solo inicia el servidor si no estamos en modo de prueba
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    httpServer.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  }).catch((error) => {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1);
  });
}

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Manejar el registro de un usuario
  socket.on('register-user', (userId: string) => {
    console.log(`Usuario ${userId} registrado con socket ${socket.id}`);
    userConnections.set(userId, socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    
    // Eliminar la conexión cuando el usuario se desconecta
    for (const [userId, socketId] of userConnections.entries()) {
      if (socketId === socket.id) {
        userConnections.delete(userId);
        console.log(`Usuario ${userId} desconectado`);
        break;
      }
    }
  });
});

// Exportar también el mapa de conexiones para usarlo en los controladores
export const getUserSocketId = (userId: string): string | undefined => {
  return userConnections.get(userId);
};

// Exportar para tests
export { httpServer, connectDB };