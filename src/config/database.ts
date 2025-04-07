import mongoose from 'mongoose';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI no está definida en las variables de entorno');
}

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log('Conectado a la base de datos de MongoDB');
    return conn;
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;