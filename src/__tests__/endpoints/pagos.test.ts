jest.mock('../../index', () => ({
  io: {
    to: jest.fn().mockReturnValue({
      emit: jest.fn(),
    }),
    emit: jest.fn(),
  },
  getUserSocketId: jest.fn().mockReturnValue(null),
}));

jest.mock('../../services/emailService', () => ({
  enviarCorreo: jest.fn().mockResolvedValue('email-message-id'),
}));

jest.mock('../../services/snsService', () => ({
  publicarVentaSNS: jest.fn().mockResolvedValue('sns-message-id'),
}));

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({ url: 'https://stripe.test/session' }),
      },
    },
  }));
});

import request from 'supertest';
import app from '../../app';
import User from '../../models/User';
import Categoria from '../../models/Categoria';
import Producto from '../../models/Producto';
import Orden from '../../models/Orden';
import DetalleOrden from '../../models/DetalleOrden';
import Pago from '../../models/Pago';
import { enviarCorreo } from '../../services/emailService';
import { publicarVentaSNS } from '../../services/snsService';

const mockedEnviarCorreo = jest.mocked(enviarCorreo);
const mockedPublicarVentaSNS = jest.mocked(publicarVentaSNS);

describe('Flujo de compra y notificación SNS', () => {
  beforeEach(() => {
    mockedEnviarCorreo.mockClear();
    mockedPublicarVentaSNS.mockClear();
  });

  test('registra usuarios, confirma una compra y publica notificaciones reales para email y SNS', async () => {
    const buyerData = {
      nombre: 'Comprador Prueba',
      email: 'comprador.prueba@iteso.mx',
      contrasena: 'password123',
    };

    const sellerData = {
      nombre: 'Vendedor Prueba',
      email: 'vendedor.prueba@iteso.mx',
      contrasena: 'password123',
    };

    const buyerRegister = await request(app).post('/auth/register').send(buyerData);
    const sellerRegister = await request(app).post('/auth/register').send(sellerData);

    expect(buyerRegister.status).toBe(201);
    expect(sellerRegister.status).toBe(201);

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: buyerData.email, contrasena: buyerData.contrasena });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');

    const buyer = await User.findOne({ email: buyerData.email });
    const seller = await User.findOne({ email: sellerData.email });

    expect(buyer).not.toBeNull();
    expect(seller).not.toBeNull();

    const categoria = await Categoria.create({ nombre: 'Tecnologia' });

    const producto = await Producto.create({
      usuario_id: seller!._id,
      categoria_id: categoria._id,
      titulo: 'Laptop usada',
      precio: 12000,
      descripcion: 'Laptop para prueba e2e',
      stock: 5,
      estado: 'activo',
    });

    const orden = await Orden.create({
      usuario_id: buyer!._id,
      productos_id: [producto._id],
      total: 12000,
      estado: 'pendiente',
      metodo_pago: 'stripe',
      punto_encuentro: 'Biblioteca ITESO',
    });

    await DetalleOrden.create({
      orden_id: orden._id,
      producto_id: producto._id,
      cantidad: 1,
      precio_unitario: 12000,
    });

    const pago = await Pago.create({
      orden_id: orden._id,
      usuario_id: buyer!._id,
      monto: 12000,
      estado: 'pendiente',
    });

    const confirmResponse = await request(app)
      .get(`/pagos/confirmar/${pago._id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(confirmResponse.status).toBe(200);
    expect(confirmResponse.body).toHaveProperty('message', 'Pago confirmado');

    const pagoActualizado = await Pago.findById(pago._id);
    const ordenActualizada = await Orden.findById(orden._id);

    expect(pagoActualizado?.estado).toBe('completado');
    expect(ordenActualizada?.estado).toBe('pagado');

    expect(mockedEnviarCorreo).toHaveBeenCalledTimes(2);
    expect(mockedEnviarCorreo).toHaveBeenCalledWith(
      expect.objectContaining({
        destinatario: sellerData.email,
        asunto: '¡Has vendido un producto!',
      })
    );
    expect(mockedEnviarCorreo).toHaveBeenCalledWith(
      expect.objectContaining({
        destinatario: buyerData.email,
        asunto: 'Confirmación de tu compra - Ecommerce ITESO',
      })
    );

    expect(mockedPublicarVentaSNS).toHaveBeenCalledTimes(1);
    expect(mockedPublicarVentaSNS).toHaveBeenCalledWith(
      expect.objectContaining({
        sellerEmail: sellerData.email,
        buyerEmail: buyerData.email,
        paymentId: pago._id.toString(),
        orderId: orden._id.toString(),
        product: expect.objectContaining({
          title: 'Laptop usada',
          quantity: 1,
          total: 12000,
        }),
      })
    );
  });
});
