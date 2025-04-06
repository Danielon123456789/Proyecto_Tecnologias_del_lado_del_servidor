import { Request, Response } from 'express';
import DetalleOrden from '../models/DetalleOrden';
import { HttpStatus } from '../types/http-status';

// Crear un detalle de orden (admin o pruebas)
export async function crearDetalleOrden(req: Request, res: Response): Promise<void> {
  try {
    const { orden_id, producto_id, cantidad, precio_unitario } = req.body;

    const detalle = new DetalleOrden({
      orden_id,
      producto_id,
      cantidad,
      precio_unitario,
    });

    await detalle.save();
    res.status(HttpStatus.CREATED).json(detalle);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al crear detalle de orden', error });
  }
}

// Obtener todos los detalles de una orden
export async function getDetallesPorOrden(req: Request, res: Response): Promise<void> {
  try {
    const { orden_id } = req.params;

    const detalles = await DetalleOrden.find({ orden_id }).populate('producto_id', 'titulo precio descripcion imagenes');
    res.json(detalles);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener detalles', error });
  }
}

// Obtener un detalle específico por ID
export async function getDetalleOrden(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const detalle = await DetalleOrden.findById(id).populate('producto_id', 'titulo precio');

    if (!detalle) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Detalle no encontrado' });
      return;
    }

    res.json(detalle);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener detalle', error });
  }
}

// Actualizar detalle de orden
export async function actualizarDetalleOrden(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const actualizado = await DetalleOrden.findByIdAndUpdate(id, req.body, { new: true });

    if (!actualizado) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Detalle no encontrado' });
      return;
    }

    res.json(actualizado);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al actualizar detalle', error });
  }
}

// Eliminar detalle de orden
export async function eliminarDetalleOrden(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const eliminado = await DetalleOrden.findByIdAndDelete(id);

    if (!eliminado) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Detalle no encontrado' });
      return;
    }

    res.json({ message: 'Detalle eliminado correctamente' });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar detalle', error });
  }
}
