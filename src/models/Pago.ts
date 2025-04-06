import mongoose from 'mongoose';

const PagoSchema = new mongoose.Schema({
  orden_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ordenes', required: true },
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  monto: { type: Number, required: true },
  fecha_pago: { type: Date, default: Date.now },
  estado: { type: String, enum: ['pendiente', 'completado', 'fallido'], default: 'pendiente' }
});

const pagoModel = mongoose.model('pagos', PagoSchema);
export default pagoModel;
