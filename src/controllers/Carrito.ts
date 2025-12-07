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
    console.log("➡️ verCarrito");

    const usuario_id = req.user?.id;

    console.log("usuario_id:", usuario_id);

    const carrito = await Carrito
      .findOne({ usuario_id })
      .populate({ path: 'productos.producto', model: 'productos' });

    console.log("carrito:", carrito);

    if (!carrito) {
      res.json({ productos: [], total: 0 });
      return;
    }

    const total = carrito.productos.reduce((acc: number, item: any) => {
      const prod = item.producto;
      if (!prod || typeof prod !== "object") return acc;
      return acc + (prod.precio || 0) * item.cantidad;
    }, 0);

    res.json({ productos: carrito.productos, total });

  } catch (error) {
    console.error("❌ ERROR EN verCarrito:", error);
    res.status(500).json({ message: 'Error al obtener carrito', error });
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

    const carrito = await Carrito.findOne({ usuario_id }).populate({
      path: 'productos.producto',
      model: 'productos'
    });

    if (!carrito || carrito.productos.length === 0) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Carrito vacío' });
      return;
    }

    // 1. Verificar stock disponible antes de crear la orden
    for (const item of carrito.productos) {
      const prodId = typeof item.producto === 'object' && item.producto !== null && '_id' in item.producto
        ? (item.producto as any)._id
        : item.producto;
      const producto = await Producto.findById(prodId);
      if (!producto) {
        res.status(HttpStatus.NOT_FOUND).json({ message: `Producto ${prodId} no encontrado` });
        return;
      }
      if (producto.stock < item.cantidad) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: `Stock insuficiente para ${producto.titulo}. Disponible: ${producto.stock}, solicitado: ${item.cantidad}`
        });
        return;
      }
    }

    // 2. Calcular total
    let total = 0;
    for (const item of carrito.productos) {
      if (typeof item.producto === 'object' && item.producto !== null && 'precio' in item.producto) {
        const producto = item.producto as any;
        total += (producto.precio || 0) * item.cantidad;
      }
    }

    // 3. Crear orden
    const orden = new Orden({
      usuario_id,
      total,
      metodo_pago,
      punto_encuentro,
      estado: 'pendiente',
    });
    const ordenGuardada = await orden.save();

    // 4. Crear detalles de orden y ajustar stock/estado de producto
    for (const item of carrito.productos) {
      if (
        typeof item.producto === 'object' &&
        item.producto !== null &&
        'precio' in item.producto &&
        '_id' in item.producto
      ) {
        const producto = item.producto as any;

        const detalle = new DetalleOrden({
          orden_id: ordenGuardada._id,
          producto_id: producto._id,
          cantidad: item.cantidad,
          precio_unitario: producto.precio,
        });
        await detalle.save();

        const nuevoStock = (producto.stock ?? 0) - item.cantidad;
        await Producto.findByIdAndUpdate(
          producto._id,
          {
            stock: nuevoStock,
            estado: nuevoStock <= 0 ? 'inactivo' : 'activo'
          }
        );
      }
    }

    // 5. Vaciar carrito
    carrito.productos = [];
    await carrito.save();

    res.status(HttpStatus.CREATED).json({ message: 'Compra realizada con éxito', orden: ordenGuardada });
  } catch (error) {
    console.error('ERROR EN COMPRA:', error);
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