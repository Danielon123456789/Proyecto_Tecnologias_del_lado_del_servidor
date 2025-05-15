// __tests__/endpoints/auth.test.ts
import request from 'supertest';
import app from '../../app';
import User from '../../models/User';

describe('Endpoints de Autenticación', () => {
  beforeEach(async () => {
    // Crear un usuario para pruebas de login
    await User.create({
      nombre: 'Usuario Existente',
      email: 'existente@iteso.mx',
      contrasena: 'password123'
    });
  });

  describe('POST /auth/register', () => {
    test('debería registrar un nuevo usuario', async () => {
      const userData = {
        nombre: 'Nuevo Usuario',
        email: 'nuevo@iteso.mx',
        contrasena: 'password123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Usuario registrado correctamente');
      
      // Verificar que el usuario se creó
      const user = await User.findOne({ email: 'nuevo@iteso.mx' });
      expect(user).not.toBeNull();
      expect(user?.nombre).toBe(userData.nombre);
    });

    test('debería rechazar un email duplicado', async () => {
      const userData = {
        nombre: 'Usuario Duplicado',
        email: 'existente@iteso.mx', // Email ya existe
        contrasena: 'password123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'El usuario ya está registrado');
    });
  });

  describe('POST /auth/login', () => {
    test('debería iniciar sesión y devolver un token', async () => {
      const loginData = {
        email: 'existente@iteso.mx',
        contrasena: 'password123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    test('debería rechazar credenciales incorrectas', async () => {
      const loginData = {
        email: 'existente@iteso.mx',
        contrasena: 'passwordIncorrecto'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Credenciales incorrectas');
    });
  });
});