import { Response } from 'express';
import Orden from '../models/Orden';
import DetalleOrden from '../models/DetalleOrden';
import { HttpStatus } from '../types/http-status';
import { IGetUserAuthInfoRequest } from '../types/request';

// Crear una orden
export const crearOrden = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const usuario_id = req.user?.id;
    const { productos, metodo_pago, punto_encuentro } = req.body;

    if (!productos || productos.length === 0) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'No hay productos en la orden' });
      return;
    }

    let total = 0;
    const productos_id = productos.map((item: any) => item.producto_id);

    for (const item of productos) {
      total += item.precio_unitario * item.cantidad;
    }

    const nuevaOrden = new Orden({
      usuario_id,
      productos_id,
      total,
      metodo_pago,
      punto_encuentro,
    });

    const ordenGuardada = await nuevaOrden.save();

    for (const item of productos) {
      const detalle = new DetalleOrden({
        orden_id: ordenGuardada._id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      });
      await detalle.save();
    }

    res.status(HttpStatus.CREATED).json({ orden: ordenGuardada });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al crear la orden', error });
  }
};

// Obtener todas las órdenes (admin)
export async function getTodasLasOrdenes(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const ordenes = await Orden.find().populate('usuario_id', 'nombre email');
    res.json(ordenes.map(o => ({
      ...o.toObject(),
      productos_id: o.productos_id.map(p => p.toString())
    })));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener órdenes', error });
  }
}

// Obtener órdenes del usuario autenticado
export async function getOrdenesUsuario(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const usuario_id = req.user?.id;
    const ordenes = await Orden.find({ usuario_id }).sort({ createdAt: -1 });
    res.json(ordenes.map(o => ({
      ...o.toObject(),
      productos_id: o.productos_id.map(p => p.toString())
    })));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener tus órdenes', error });
  }
}

// Obtener una orden por ID
export async function getOrden(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const orden = await Orden.findById(id).populate('usuario_id', 'nombre');

    if (!orden) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Orden no encontrada' });
      return;
    }

    res.json({
      ...orden.toObject(),
      productos_id: orden.productos_id.map(p => p.toString())
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener orden', error });
  }
}

// Actualizar una orden
export async function actualizarOrden(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const actualizada = await Orden.findByIdAndUpdate(id, req.body, { new: true });

    if (!actualizada) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Orden no encontrada' });
      return;
    }

    res.json({
      ...actualizada.toObject(),
      productos_id: actualizada.productos_id.map(p => p.toString())
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al actualizar orden', error });
  }
}

// Eliminar una orden
export async function eliminarOrden(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const eliminada = await Orden.findByIdAndDelete(id);

    if (!eliminada) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Orden no encontrada' });
      return;
    }

    await DetalleOrden.deleteMany({ orden_id: id });

    res.json({ message: 'Orden eliminada correctamente' });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar orden', error });
  }
}
