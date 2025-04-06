import { Response } from 'express';
import Pago from '../models/Pago';
import Orden from '../models/Orden';
import { HttpStatus } from '../types/http-status';
import { IGetUserAuthInfoRequest } from '../types/request';

// Iniciar proceso de pago
export async function checkout(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const usuario_id = req.user?.id;
    const { orden_id, monto, metodo_pago } = req.body;

    const orden = await Orden.findById(orden_id);
    if (!orden || orden.usuario_id.toString() !== usuario_id) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Orden no encontrada o no autorizada' });
      return;
    }

    const pago = new Pago({
      orden_id,
      usuario_id,
      monto,
      metodo_pago,
      estado: 'pendiente',
    });

    await pago.save();

    // Aquí se integraría con Stripe, PayPal, etc.

    res.status(HttpStatus.CREATED).json({ message: 'Pago iniciado', pago });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al iniciar el pago', error });
  }
}

// Confirmar pago
export async function confirmarPago(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const pago = await Pago.findById(id);
    if (!pago) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Pago no encontrado' });
      return;
    }

    pago.estado = 'completado';
    pago.fecha_pago = new Date();

    await pago.save();

    await Orden.findByIdAndUpdate(pago.orden_id, { estado: 'pagado' });

    res.json({ message: 'Pago confirmado', pago });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al confirmar pago', error });
  }
}

// Historial de pagos del usuario
export async function historialPagos(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const usuario_id = req.user?.id;
    const pagos = await Pago.find({ usuario_id }).sort({ fecha_pago: -1 });

    res.json(pagos);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener historial de pagos', error });
  }
}

// Obtener pago por ID
export async function getPago(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const pago = await Pago.findById(id).populate('orden_id');

    if (!pago) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Pago no encontrado' });
      return;
    }

    res.json(pago);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener el pago', error });
  }
}

// Eliminar pago
export async function eliminarPago(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const pago = await Pago.findByIdAndDelete(id);

    if (!pago) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Pago no encontrado' });
      return;
    }

    res.json({ message: 'Pago eliminado correctamente' });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar el pago', error });
  }
}
