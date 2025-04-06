import { Response } from 'express';
import Reporte from '../models/Reporte';
import Producto from '../models/Producto';
import { HttpStatus } from '../types/http-status';
import { IGetUserAuthInfoRequest } from '../types/request';

// Crear reporte de producto
export async function crearReporte(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const usuario_reportado_id = req.user?.id;
    const { producto_reportado_id, razon } = req.body;

    const producto = await Producto.findById(producto_reportado_id);
    if (!producto) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Producto no encontrado' });
      return;
    }

    const reporte = new Reporte({
      usuario_reportado_id,
      producto_reportado_id,
      razon,
    });

    await reporte.save();

    res.status(HttpStatus.CREATED).json({ message: 'Reporte enviado correctamente', reporte });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al enviar el reporte', error });
  }
}

// Obtener todos los reportes (admin)
export async function getReportes(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const reportes = await Reporte.find()
      .populate('producto_reportado_id', 'titulo descripcion')
      .populate('usuario_reportado_id', 'nombre email');

    res.json(reportes);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener reportes', error });
  }
}

// Obtener un reporte específico
export async function getReporte(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const reporte = await Reporte.findById(id)
      .populate('producto_reportado_id', 'titulo')
      .populate('usuario_reportado_id', 'nombre');

    if (!reporte) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Reporte no encontrado' });
      return;
    }

    res.json(reporte);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener el reporte', error });
  }
}

// Marcar reporte como resuelto
export async function resolverReporte(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const reporte = await Reporte.findByIdAndUpdate(id, { resuelto: true }, { new: true });

    if (!reporte) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Reporte no encontrado' });
      return;
    }

    res.json({ message: 'Reporte marcado como resuelto', reporte });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al actualizar reporte', error });
  }
}

// Eliminar un reporte
export async function eliminarReporte(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const eliminado = await Reporte.findByIdAndDelete(id);

    if (!eliminado) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Reporte no encontrado' });
      return;
    }

    res.json({ message: 'Reporte eliminado correctamente' });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar reporte', error });
  }
}
