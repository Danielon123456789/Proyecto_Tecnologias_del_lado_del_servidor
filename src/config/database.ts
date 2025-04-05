import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI as string;

mongoose.set('strictQuery', false);

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(MONGO_URI);
        console.log('Conectado a la base de datos de MongoDB')
        return conn;
    } catch (error){
        throw error;
    }
};

export default connectDB;

