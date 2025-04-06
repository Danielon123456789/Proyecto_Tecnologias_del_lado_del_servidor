import mongoose from 'mongoose';

const DetalleOrdenSchema = new mongoose.Schema({
  orden_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ordenes', required: true },
  producto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'productos', required: true },
  cantidad: { type: Number, required: true },
  precio_unitario: { type: Number, required: true }
});

const detalleOrdenModel = mongoose.model('detalle_ordenes', DetalleOrdenSchema);
export default detalleOrdenModel;
