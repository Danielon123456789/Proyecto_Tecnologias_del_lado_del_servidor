import mongoose from 'mongoose';

const ReporteSchema = new mongoose.Schema({
  usuario_reportado_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  producto_reportado_id: { type: mongoose.Schema.Types.ObjectId, ref: 'productos', required: true },
  razon: { type: String, required: true },
  fecha_reporte: { type: Date, default: Date.now },
  resuelto: { type: Boolean, default: false }
});

const reporteModel = mongoose.model('reportes', ReporteSchema);
export default reporteModel;
