import mongoose from 'mongoose';

const ProductoSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  categoria_id: { type: mongoose.Schema.Types.ObjectId, ref: 'categorias', required: true },
  titulo: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: String,
  stock: { type: Number, default: 0 },
  fecha_publicacion: { type: Date, default: Date.now },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  imageUrl: { type: String, default: '' }
});

const productoModel = mongoose.model('productos', ProductoSchema);
export default productoModel;
