import mongoose from 'mongoose';

const CarritoSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productos: [{
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    cantidad: { type: Number, required: true, default: 1 }
  }]
});

export default mongoose.model('Carrito', CarritoSchema);
