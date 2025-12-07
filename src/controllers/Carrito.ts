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
    const carrito = await Carrito.findOne({ usuario_id }).populate('productos.producto');

    if (!carrito || carrito.productos.length === 0) {
      res.status(400).json({ message: 'El carrito está vacío' });
      return;
    }

    // 1. Verificar stock disponible ANTES de crear la orden
    for (const item of carrito.productos) {
      const producto = await Producto.findById(item.producto);
      if (!producto) {
        res.status(404).json({ message: `Producto ${item.producto} no encontrado` });
        return;
      }
      if (producto.stock < item.cantidad) {
        res.status(400).json({ 
          message: `Stock insuficiente para ${producto.titulo}. Disponible: ${producto.stock}, solicitado: ${item.cantidad}` 
        });
        return;
      }
    }

    // 2. Crear la orden
    const nuevaOrden = new Orden({
      usuario_id,
      productos: carrito.productos,
      total: carrito.productos.reduce((acc: number, item: any) => 
        acc + (item.producto.precio * item.cantidad), 0
      ),
      estado: 'pendiente'
    });
    await nuevaOrden.save();

    // 3. Disminuir el stock de cada producto y cambiar estado si es necesario
    for (const item of carrito.productos) {
      const producto = await Producto.findById(item.producto?._id);
      const nuevoStock = producto!.stock - item.cantidad;
      
      await Producto.findByIdAndUpdate(
        item.producto?._id,
        { 
          stock: nuevoStock,
          estado: nuevoStock <= 0 ? 'inactivo' : 'activo'
        }
      );
    }

    // 4. Vaciar el carrito
    carrito.productos = [];
    await carrito.save();

    res.status(201).json({ message: 'Compra realizada', orden: nuevaOrden });
  } catch (error) {
    res.status(500).json({ message: 'Error al realizar compra', error });
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