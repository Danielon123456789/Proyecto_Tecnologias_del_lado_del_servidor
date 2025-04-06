import { Request, Response } from 'express';
import Categoria from '../models/Categoria';
import { HttpStatus } from '../types/http-status';

// Crear categoría
export async function crearCategoria(req: Request, res: Response): Promise<void> {
  try {
    const { nombre } = req.body;
    const existente = await Categoria.findOne({ nombre });

    if (existente) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'La categoría ya existe' });
      return;
    }

    const nuevaCategoria = new Categoria({ nombre });
    await nuevaCategoria.save();

    res.status(HttpStatus.CREATED).json(nuevaCategoria);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al crear la categoría', error });
  }
}

// Obtener todas las categorías
export async function getCategorias(req: Request, res: Response): Promise<void> {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener categorías', error });
  }
}

// Obtener una categoría por ID
export async function getCategoria(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findById(id);

    if (!categoria) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Categoría no encontrada' });
      return;
    }

    res.json(categoria);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener la categoría', error });
  }
}

// Editar categoría
export async function editarCategoria(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const categoria = await Categoria.findByIdAndUpdate(id, { nombre }, { new: true });

    if (!categoria) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Categoría no encontrada' });
      return;
    }

    res.json(categoria);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al actualizar la categoría', error });
  }
}

// Eliminar categoría
export async function eliminarCategoria(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const resultado = await Categoria.findByIdAndDelete(id);

    if (!resultado) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Categoría no encontrada' });
      return;
    }

    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar la categoría', error });
  }
}
