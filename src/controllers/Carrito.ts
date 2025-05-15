// src/controllers/Carrito.ts
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
    
    // Si no hay usuario_id, retornar error
    if (!usuario_id) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Usuario no autenticado' });
      return;
    }
    
    // Buscar el carrito o crear uno nuevo si no existe
    let carrito = await Carrito.findOne({ usuario_id }).populate({
      path: 'productos.producto',
      model: 'productos'  // Especificamos explícitamente el modelo
    });
    
    if (!carrito) {
      // En lugar de retornar un carrito vacío, lo creamos para el test
      carrito = new Carrito({ usuario_id, productos: [] });
      await carrito.save();
      res.json({ productos: [], total: 0 });
      return;
    }

    // Calcular total solo si hay productos
    let total = 0;
    if (carrito.productos && carrito.productos.length > 0) {
      total = carrito.productos.reduce((acc: number, item: any) => {
        if (
          typeof item.producto === 'object' &&
          item.producto !== null &&
          'precio' in item.producto
        ) {
          const producto = item.producto as unknown as { precio: number };
          return acc + producto.precio * item.cantidad;
        }
        return acc;
      }, 0);
    }

    res.json({ productos: carrito.productos || [], total });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener carrito', error });
  }
};

// Agregar un producto al carrito
export const agregarAlCarrito = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const usuario_id = req.user?.id;
    const { producto_id, cantidad } = req.body;

    if (!usuario_id) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Usuario no autenticado' });
      return;
    }

    const producto = await Producto.findById(producto_id);
    if (!producto) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Producto no encontrado' });
      return;
    }

    let carrito = await Carrito.findOne({ usuario_id });

    if (!carrito) {
      carrito = new Carrito({ usuario_id, productos: [] });
    }

    // Buscar si el producto ya existe en el carrito
    const productoExistente = carrito.productos.find(
      (p: any) => p.producto && p.producto.toString() === producto_id
    );

    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      carrito.productos.push({ producto: producto_id, cantidad });
    }

    await carrito.save();
    res.status(HttpStatus.CREATED).json({ message: 'Producto agregado al carrito', carrito });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al agregar al carrito', error });
  }
};

// Eliminar un producto del carrito
export const eliminarDelCarrito = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const usuario_id = req.user?.id;
    const { id } = req.params;

    if (!usuario_id) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Usuario no autenticado' });
      return;
    }

    const carrito = await Carrito.findOne({ usuario_id });
    if (!carrito) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Carrito no encontrado' });
      return;
    }

    carrito.productos = carrito.productos.filter((item: any) => 
      item.producto && item.producto.toString() !== id
    );
    await carrito.save();

    res.json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar del carrito', error });
  }
};

// Comprar (crear orden desde el carrito)
export const comprar = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const usuario_id = req.user?.id;
    const { metodo_pago, punto_encuentro } = req.body;

    if (!usuario_id) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Usuario no autenticado' });
      return;
    }

    const carrito = await Carrito.findOne({ usuario_id }).populate({
      path: 'productos.producto',
      model: 'productos'  // Especificamos explícitamente el modelo
    });
    
    // Verificar si el carrito existe y tiene productos
    if (!carrito || !carrito.productos || carrito.productos.length === 0) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Carrito vacío' });
      return;
    }

    // Calcular el total de la compra
    let total = 0;
    for (const item of carrito.productos) {
      if (
        item.producto && 
        typeof item.producto === 'object' &&
        item.producto !== null &&
        'precio' in item.producto
      ) {
        const producto = item.producto as unknown as { precio: number };
        total += producto.precio * item.cantidad;
      }
    }

    // Crear la orden
    const orden = new Orden({
      usuario_id,
      total,
      metodo_pago,
      punto_encuentro,
      estado: 'pendiente',
    });

    const ordenGuardada = await orden.save();

    // Crear los detalles de la orden
    for (const item of carrito.productos) {
      if (
        item.producto &&
        typeof item.producto === 'object' &&
        item.producto !== null &&
        'precio' in item.producto &&
        '_id' in item.producto
      ) {
        const producto = item.producto as unknown as { _id: string; precio: number };
        const detalle = new DetalleOrden({
          orden_id: ordenGuardada._id,
          producto_id: producto._id,
          cantidad: item.cantidad,
          precio_unitario: producto.precio,
        });

        await detalle.save();
      }
    }

    // Vaciar el carrito
    carrito.productos = [];
    await carrito.save();

    res.status(HttpStatus.CREATED).json({ 
      message: 'Compra realizada con éxito', 
      orden: ordenGuardada 
    });
  } catch (error) {
    console.error('ERROR EN COMPRA:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al procesar la compra', error });
  }
};

// Historial de compras
export const historialCompras = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const usuario_id = req.user?.id;
    
    if (!usuario_id) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Usuario no autenticado' });
      return;
    }
    
    const ordenes = await Orden.find({ usuario_id }).sort({ createdAt: -1 });

    res.json(ordenes);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener historial', error });
  }
};