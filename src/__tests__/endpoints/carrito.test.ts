// __tests__/endpoints/carrito.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import User from '../../models/User';
import Producto from '../../models/Producto';
import Carrito from '../../models/Carrito';
import Categoria from '../../models/Categoria';
import { createTestToken } from '../setup';

describe('Endpoints de Carrito', () => {
  let userId: string;
  let token: string;
  let productoId: string;
  let categoriaId: string;

  beforeEach(async () => {
    // Crear usuario
    const user = new User({
      nombre: 'User Carrito',
      email: 'carrito@iteso.mx',
      contrasena: 'password123'
    });
    await user.save();
    userId = user._id.toString();
    token = createTestToken(userId);

    // Crear categoría
    const categoria = new Categoria({ nombre: 'Test' });
    await categoria.save();
    categoriaId = categoria._id.toString();

    // Crear producto
    const producto = new Producto({
      titulo: 'Producto Test',
      precio: 1000,
      descripcion: 'Producto para pruebas',
      usuario_id: userId,
      categoria_id: categoriaId
    });
    await producto.save();
    productoId = producto._id.toString();
  });

  describe('GET /carrito', () => {
    test('debería obtener carrito vacío', async () => {
      const response = await request(app)
        .get('/carrito')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('productos');
      expect(response.body.productos).toEqual([]);
      expect(response.body.total).toBe(0);
    });

    test('debería obtener carrito con productos', async () => {
      // Crear un carrito con productos directamente en la base de datos
      await Carrito.create({
        usuario_id: userId,
        productos: [{ 
          producto: productoId, 
          cantidad: 2 
        }]
      });

      const response = await request(app)
        .get('/carrito')
        .set('Authorization', `Bearer ${token}`);

      console.log('Response status:', response.status);
      console.log('Response body:', response.body);
      
      expect(response.status >= 200 && response.status < 300).toBeTruthy();
      
      // Si la respuesta es exitosa, verificamos la estructura
      if (response.status >= 200 && response.status < 300) {
        expect(response.body).toHaveProperty('productos');
        expect(response.body).toHaveProperty('total');
      }
    });
  });

  describe('POST /carrito/agregar', () => {
    test('debería agregar producto al carrito', async () => {
      const response = await request(app)
        .post('/carrito/agregar')
        .set('Authorization', `Bearer ${token}`)
        .send({
          producto_id: productoId,
          cantidad: 1
        });

      expect(response.status).toBe(201);
      
      // Verificar que se agregó al carrito
      const carrito = await Carrito.findOne({ usuario_id: userId });
      
      expect(carrito).not.toBeNull();
      expect(carrito?.productos?.length).toBe(1);
      
      const productoAgregado = carrito?.productos?.[0]?.producto?.toString();
      expect(productoAgregado).toBe(productoId);
    });
  });

  describe('DELETE /carrito/eliminar/:id', () => {
    test('debería eliminar producto del carrito', async () => {
      // Agregar producto al carrito
      await Carrito.create({
        usuario_id: userId,
        productos: [{ producto: productoId, cantidad: 1 }]
      });

      const response = await request(app)
        .delete(`/carrito/eliminar/${productoId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      
      // Verificar que se eliminó del carrito
      const carrito = await Carrito.findOne({ usuario_id: userId });
      expect(carrito?.productos?.length).toBe(0);
    });
  });

  describe('POST /carrito/comprar', () => {
    test('debería procesar la compra correctamente', async () => {
      // Crear un carrito con productos
      await Carrito.create({
        usuario_id: userId,
        productos: [{ producto: productoId, cantidad: 1 }]
      });

      const response = await request(app)
        .post('/carrito/comprar')
        .set('Authorization', `Bearer ${token}`)
        .send({
          metodo_pago: 'tarjeta',
          punto_encuentro: 'Biblioteca ITESO'
        });

      console.log('Compra status:', response.status);
      console.log('Compra body:', response.body);
      
      expect(response.status >= 200 && response.status < 300).toBeTruthy();
      
      // Si la respuesta es exitosa, verificamos la estructura básica
      if (response.status >= 200 && response.status < 300) {
        expect(response.body).toHaveProperty('message');
      }
    });

    test('debería retornar error si el carrito está vacío', async () => {
      // Crear un carrito explícitamente vacío
      await Carrito.create({
        usuario_id: userId,
        productos: []
      });

      const response = await request(app)
        .post('/carrito/comprar')
        .set('Authorization', `Bearer ${token}`)
        .send({
          metodo_pago: 'tarjeta',
          punto_encuentro: 'Biblioteca ITESO'
        });

      console.log('Carrito vacío status:', response.status);
      console.log('Carrito vacío body:', response.body);
      
      expect(response.status >= 400).toBeTruthy();
      
      // Si es un error de cliente (4xx), verificamos el mensaje
      if (response.status >= 400 && response.status < 500) {
        expect(response.body).toHaveProperty('message');
      }
    });
  });
});