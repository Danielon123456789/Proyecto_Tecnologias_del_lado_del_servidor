// Versión corregida de productos.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Producto from '../../models/Producto';
import User from '../../models/User';
import Categoria from '../../models/Categoria';
import { createTestToken } from '../setup';

describe('Endpoints de Productos', () => {
  let userId: string;
  let categoriaId: string;
  let token: string;

  beforeEach(async () => {
    // Crear usuario de prueba
    const user = new User({
      nombre: 'Test User',
      email: 'test@iteso.mx',
      contrasena: 'password123',
      rol: 'usuario'
    });
    await user.save();
    userId = user._id.toString();
    
    // Crear categoría de prueba
    const categoria = new Categoria({ nombre: 'Electrónicos' });
    await categoria.save();
    categoriaId = categoria._id.toString();
    
    // Crear token
    token = createTestToken(userId);
  });

  describe('GET /productos', () => {
    test('debería obtener una lista vacía de productos', async () => {
      const response = await request(app)
        .get('/productos');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(0);
    });

    test('debería obtener los productos creados', async () => {
      // Crear productos de prueba
      await Producto.create({
        titulo: 'Laptop HP',
        precio: 8000,
        descripcion: 'Laptop en buen estado',
        usuario_id: userId,
        categoria_id: categoriaId
      });

      const response = await request(app)
        .get('/productos');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(1);
      expect(response.body[0].titulo).toBe('Laptop HP');
    });
  });

  describe('POST /productos', () => {
    test('debería crear un nuevo producto al estar autenticado', async () => {
      const productoData = {
        titulo: 'Monitor LG',
        precio: 3000,
        descripcion: 'Monitor 24 pulgadas',
        categoria_id: categoriaId
      };

      const response = await request(app)
        .post('/productos')
        .set('Authorization', `Bearer ${token}`)
        .send(productoData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('titulo', productoData.titulo);
      expect(response.body).toHaveProperty('precio', productoData.precio);
      
      // Verificar en la base de datos
      const producto = await Producto.findById(response.body._id);
      expect(producto).not.toBeNull();
      expect(producto?.titulo).toBe(productoData.titulo);
    });

    test('debería devolver 401 si no hay autenticación', async () => {
      const productoData = {
        titulo: 'Monitor LG',
        precio: 3000,
        descripcion: 'Monitor 24 pulgadas',
        categoria_id: categoriaId
      };

      const response = await request(app)
        .post('/productos')
        .send(productoData);

      expect(response.status).toBe(401);
    });
  });
});