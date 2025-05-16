import { io, getUserSocketId } from '../index'; 
import { Response } from 'express';
import Pago from '../models/Pago';
import Orden from '../models/Orden';
import DetalleOrden from '../models/DetalleOrden'
import { HttpStatus } from '../types/http-status';
import { IGetUserAuthInfoRequest } from '../types/request';
import { enviarCorreo } from '../services/emailService';
import User from '../models/User';
import Producto from '../models/Producto';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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

    // Crear sesión de pago de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: `Compra de productos`,
            },
            unit_amount: Math.round(monto * 100), // en centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/pago-exitoso/${pago._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/pago-cancelado/${pago._id}`,
    });

    res.status(HttpStatus.CREATED).json({
      message: 'Pago iniciado',
      pago,
      sessionUrl: session.url,
    });
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

    const orden = await Orden.findById(pago.orden_id);
    if (!orden) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Orden no encontrada' });
      return;
    }

    const comprador = await User.findById(pago.usuario_id);
    const detalles = await DetalleOrden.find({ orden_id: orden._id }).populate('producto_id');
    const productosComprados: string[] = [];

    for (const detalle of detalles) {
      const producto = detalle.producto_id as any;

      productosComprados.push(
        `<li>${producto.titulo} x${detalle.cantidad} - $${detalle.precio_unitario * detalle.cantidad}</li>`
      );

      if (producto.stock !== undefined) {
        const nuevoStock = producto.stock - detalle.cantidad;
        if (nuevoStock < 0) {
          console.warn(`Stock negativo para producto ${producto._id}`);
        } else {
          await Producto.findByIdAndUpdate(producto._id, { stock: nuevoStock });
        }
      }

      const vendedor = await User.findById(producto.usuario_id);
      if (vendedor?.email) {
        await enviarCorreo({
          destinatario: vendedor.email,
          asunto: '¡Has vendido un producto!',
          cuerpoHtml: `
            <h2>Notificación de Venta - Ecommerce ITESO</h2>
            <p>Estimado/a ${vendedor.nombre || 'vendedor'},</p>
            <p>Te informamos que has vendido el producto <strong>${producto.titulo}</strong>.</p>
            <p><strong>Cantidad:</strong> ${detalle.cantidad}</p>
            <p><strong>Total:</strong> $${detalle.precio_unitario * detalle.cantidad}</p>
            <p><strong>Comprador:</strong> ${comprador?.email}</p>
            <p>Gracias por utilizar nuestra plataforma.</p>
            <p><em>Ecommerce ITESO</em></p>
          `,
        });
      }

      // Notificar al vendedor por socket
      const vendedorSocketId = getUserSocketId(producto.usuario_id.toString());
      
      if (vendedorSocketId) {
        // Notificar directamente al socket del vendedor
        io.to(vendedorSocketId).emit('nueva-venta', {
          mensaje: '¡Un usuario ha comprado tu producto!',
          producto: {
            id: producto._id,
            titulo: producto.titulo,
            precio: producto.precio,
            cantidad: detalle.cantidad,
            total: detalle.precio_unitario * detalle.cantidad
          },
          comprador: {
            id: pago.usuario_id,
            nombre: comprador?.nombre || 'Usuario'
          },
          fecha: new Date()
        });
        console.log(`Notificación enviada al vendedor ${producto.usuario_id} por socket`);
      } else {
        // Fallback: emitir al canal general por si el cliente se reconecta
        io.emit(`nueva-compra-${producto.usuario_id}`, {
          mensaje: '¡Un usuario ha comprado tu producto!',
          producto: {
            id: producto._id,
            titulo: producto.titulo,
            precio: producto.precio,
          },
          compradorId: pago.usuario_id,
        });
        console.log(`Vendedor ${producto.usuario_id} no conectado, enviando a canal general`);
      }
    }

    if (comprador?.email) {
      await enviarCorreo({
        destinatario: comprador.email,
        asunto: 'Confirmación de tu compra - Ecommerce ITESO',
        cuerpoHtml: `
          <h2>Gracias por tu compra en Ecommerce ITESO</h2>
          <p>Estimado/a ${comprador.nombre || 'cliente'},</p>
          <p>Has realizado una compra con éxito. Aquí tienes los detalles:</p>
          <ul>
            ${productosComprados.join('\n')}
          </ul>
          <p><strong>Total pagado:</strong> $${pago.monto}</p>
          <p><strong>Fecha y hora de pago:</strong> ${new Date(pago.fecha_pago).toLocaleString('es-MX')}</p>
          ${orden.punto_encuentro ? `<p><strong>Punto de encuentro:</strong> ${orden.punto_encuentro}</p>` : ''}
          <p>Gracias por confiar en nuestra plataforma.</p>
          <p><em>Ecommerce ITESO</em></p>
        `,
      });
    }


    await Orden.findByIdAndUpdate(pago.orden_id, { estado: 'pagado' });

    res.json({ message: 'Pago confirmado', pago });
  } catch (error) {
    console.error('Error al confirmar pago:', error);
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