import { Response } from 'express';
import Carrito from '../models/Carrito';
import Producto from '../models/Producto';
import Orden from '../models/Orden';
import DetalleOrden from '../models/DetalleOrden';
import { IGetUserAuthInfoRequest } from '../types/request';
import { HttpStatus } from '../types/http-status';

// Ver contenido del carrito
export const verCarrito = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const usuario_id = req.user?.id;
    const carrito = await Carrito.findOne({ usuario_id }).populate('productos.producto');

    if (!carrito) {
      res.json({ productos: [], total: 0 });
      return;
    }

    const total = carrito.productos.reduce((acc: number, item: any) => {
      const precio = item.producto?.precio ?? 0;
      return acc + precio * item.cantidad;
    }, 0);

    res.json({ productos: carrito.productos, total });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener carrito', error });
  }
};

// Agregar un producto al carrito
export const agregarAlCarrito = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const usuario_id = req.user?.id;
    const { producto_id, cantidad } = req.body;

    const producto = await Producto.findById(producto_id);
    if (!producto) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Producto no encontrado' });
      return;
    }

    let carrito = await Carrito.findOne({ usuario_id });

    if (!carrito) {
      carrito = new Carrito({ usuario_id, productos: [] });
    }

    const existente = carrito.productos.find((p: any) => p.producto.toString() === producto_id);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      carrito.productos.push({ producto: producto_id, cantidad });
    }

    await carrito.save();
    res.status(HttpStatus.CREATED).json({ message: 'Producto agregado al carrito', carrito });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al agregar al carrito', error });
  }
};

// Eliminar un producto del carrito
export const eliminarDelCarrito = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const usuario_id = req.user?.id;
    const { id } = req.params;

    const carrito = await Carrito.findOne({ usuario_id });
    if (!carrito) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Carrito no encontrado' });
      return;
    }

    carrito.productos = carrito.productos.filter((item: any) => item.producto.toString() !== id);
    await carrito.save();

    res.json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar del carrito', error });
  }
};

// Comprar (crear orden desde el carrito)
export const comprar = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const usuario_id = req.user?.id;
    const { metodo_pago, punto_encuentro } = req.body;

    const carrito = await Carrito.findOne({ usuario_id }).populate('productos.producto');
    if (!carrito || carrito.productos.length === 0) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Carrito vacío' });
      return;
    }

    let total = 0;
    for (const item of carrito.productos) {
      total += item.producto.precio * item.cantidad;
    }

    const orden = new Orden({
      usuario_id,
      total,
      metodo_pago,
      punto_encuentro,
      estado: 'pendiente',
    });

    const ordenGuardada = await orden.save();

    for (const item of carrito.productos) {
      const detalle = new DetalleOrden({
        orden_id: ordenGuardada._id,
        producto_id: item.producto._id,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio,
      });

      await detalle.save();
    }

    carrito.productos = [];
    await carrito.save();

    res.status(HttpStatus.CREATED).json({ message: 'Compra realizada con éxito', orden: ordenGuardada });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al procesar la compra', error });
  }
};

// Historial de compras
export const historialCompras = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const usuario_id = req.user?.id;
    const ordenes = await Orden.find({ usuario_id }).sort({ createdAt: -1 });

    res.json(ordenes);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener historial', error });
  }
};
