// __tests__/setup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Importar los esquemas de modelos explícitamente para asegurar que estén registrados
import userModel from '../models/User';
import categoriaModel from '../models/Categoria';
import productoModel from '../models/Producto';
import carritoModel from '../models/Carrito';
import ordenModel from '../models/Orden';
import detalleOrdenModel from '../models/DetalleOrden';
import reporteModel from '../models/Reporte';
import pagoModel from '../models/Pago';
import fileModel from '../models/File';

let mongoServer: MongoMemoryServer;
const JWT_SECRET_TEST = 'test_secret_key_for_unit_tests';

// Configurar antes de todas las pruebas
beforeAll(async () => {
  // Establecer el JWT_SECRET para pruebas
  process.env.JWT_SECRET = JWT_SECRET_TEST;

  // Cerrar cualquier conexión existente primero
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  // Crear y conectar a la base de datos en memoria
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Conectar a la base de datos en memoria
  await mongoose.connect(uri);
  
  // Verificar que todos los modelos estén registrados correctamente
  const modelNames = mongoose.modelNames();
  console.log('Registered models:', modelNames);
  
  console.log('Test database connected');
});

// Limpiar después de cada prueba
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Cerrar conexión después de todas las pruebas
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Función de ayuda para crear token de prueba
export const createTestToken = (userId: string, rol: string = 'usuario') => {
  return jwt.sign(
    { id: userId, email: 'test@iteso.mx', rol }, 
    JWT_SECRET_TEST, 
    { expiresIn: '1h' }
  );
};