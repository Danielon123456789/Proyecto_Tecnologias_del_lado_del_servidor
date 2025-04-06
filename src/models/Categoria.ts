import mongoose from 'mongoose';

const CategoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true }
});

const categoriaModel = mongoose.model('categorias', CategoriaSchema);
export default categoriaModel;
