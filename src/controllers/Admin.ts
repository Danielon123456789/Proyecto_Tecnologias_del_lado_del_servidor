import { Request, Response } from 'express';
import User from '../models/User';
import Producto from '../models/Producto';
import Reporte from '../models/Reporte';
import { HttpStatus } from '../types/http-status';

// Obtener todos los usuarios
export async function getUsuarios(req: Request, res: Response): Promise<void> {
  try {
    const usuarios = await User.find().select('-contrasena');
    res.json(usuarios);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener usuarios', error });
  }
}

// Eliminar usuario (como admin)
export async function eliminarUsuario(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const eliminado = await User.findByIdAndDelete(id);

    if (!eliminado) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar usuario', error });
  }
}

// Obtener productos reportados
export async function getProductosReportados(req: Request, res: Response): Promise<void> {
  try {
    const reportes = await Reporte.find({ resuelto: false })
      .populate('producto_reportado_id', 'titulo descripcion')
      .populate('usuario_reportado_id', 'nombre');

    res.json(reportes);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener reportes', error });
  }
}

// Eliminar producto como admin (y los reportes relacionados)
export async function eliminarProductoAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const eliminado = await Producto.findByIdAndDelete(id);
    if (!eliminado) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Producto no encontrado' });
      return;
    }

    await Reporte.deleteMany({ producto_reportado_id: id });

    res.json({ message: 'Producto eliminado correctamente por el admin' });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar producto', error });
  }
}
