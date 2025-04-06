import { Request, Response } from 'express';
import Producto from '../models/Producto';
import { HttpStatus } from '../types/http-status';
import { IGetUserAuthInfoRequest } from '../types/request';

// Obtener todos los productos
export async function getProductos(req: Request, res: Response): Promise<void> {
  try {
    const productos = await Producto.find()
      .populate('usuario_id', 'nombre')
      .populate('categoria_id', 'nombre');

    res.json(productos);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener productos', error });
  }
}

// Obtener un producto por ID
export async function getProducto(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const producto = await Producto.findById(id)
      .populate('usuario_id', 'nombre')
      .populate('categoria_id', 'nombre');

    if (!producto) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Producto no encontrado' });
      return;
    }

    res.json(producto);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener producto', error });
  }
}

// Crear producto
export async function crearProducto(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const { titulo, precio, descripcion, stock, categoria_id, imagenes } = req.body;
    const usuario_id = req.user?.id;

    const nuevoProducto = new Producto({
      usuario_id,
      categoria_id,
      titulo,
      precio,
      descripcion,
      stock,
      imagenes
    });

    await nuevoProducto.save();
    res.status(HttpStatus.CREATED).json(nuevoProducto);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al crear producto', error });
  }
}

// Editar producto
export async function editarProducto(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    const producto = await Producto.findByIdAndUpdate(id, datosActualizados, { new: true });
    if (!producto) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Producto no encontrado' });
      return;
    }

    res.json(producto);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al actualizar producto', error });
  }
}

// Eliminar producto
export async function eliminarProducto(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const producto = await Producto.findByIdAndDelete(id);

    if (!producto) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Producto no encontrado' });
      return;
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar producto', error });
  }
}

// Buscar productos por criterio
export async function buscarProductos(req: Request, res: Response): Promise<void> {
  try {
    const { q, min, max, categoria } = req.query;
    const filtro: any = {};

    if (q) {
      filtro.$or = [
        { titulo: { $regex: q, $options: 'i' } },
        { descripcion: { $regex: q, $options: 'i' } }
      ];
    }

    if (min || max) {
      filtro.precio = {};
      if (min) filtro.precio.$gte = Number(min);
      if (max) filtro.precio.$lte = Number(max);
    }

    if (categoria) {
      filtro.categoria_id = categoria;
    }

    const productos = await Producto.find(filtro);
    res.json(productos);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al buscar productos', error });
  }
}

// Obtener productos por categoría
export async function productosPorCategoria(req: Request, res: Response): Promise<void> {
  try {
    const { categoria } = req.params;
    const productos = await Producto.find({ categoria_id: categoria });
    res.json(productos);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener productos por categoría', error });
  }
}
