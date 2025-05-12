import mongoose from 'mongoose';

const OrdenSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  productos_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'productos', required: true }],
  total: { type: Number, required: true },
  estado: { type: String, enum: ['pendiente', 'pagado', 'cancelado'], default: 'pendiente' },
  fecha_compra: { type: Date, default: Date.now },
  metodo_pago: String,
  punto_encuentro: String
});


const ordenModel = mongoose.model('ordenes', OrdenSchema);
export default ordenModel;
