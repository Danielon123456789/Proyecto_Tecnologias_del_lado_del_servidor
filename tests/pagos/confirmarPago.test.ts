import { confirmarPago } from '../../src/controllers/Pagos';
import * as emailService from '../../src/services/emailService';
import Pago from '../../src/models/Pago';
import Orden from '../../src/models/Orden';
import Producto from '../../src/models/Producto';
import User from '../../src/models/User';
import { Request, Response } from 'express';

jest.mock('../../src/services/emailService');
jest.mock('../../src/models/Pago');
jest.mock('../../src/models/Orden');
jest.mock('../../src/models/Producto');
jest.mock('../../src/models/User');

describe('confirmarPago', () => {
  const mockSend = jest.fn();
  const mockRes = {
    status: jest.fn(() => mockRes),
    json: jest.fn(),
  } as unknown as Response;

  const mockPago = {
    _id: 'pago123',
    orden_id: 'orden123',
    usuario_id: 'comprador123',
    estado: 'pendiente',
    save: jest.fn(),
  };

  const mockOrden = {
    _id: 'orden123',
    productos_id: ['prod1', 'prod2'],
  };

  const mockProductos = [
    { _id: 'prod1', titulo: 'Producto 1', precio: 100, usuario_id: 'vendedor1' },
    { _id: 'prod2', titulo: 'Producto 2', precio: 200, usuario_id: 'vendedor2' },
  ];

  const mockUsuarios: {
  [key: string]: { _id: string; email: string };
} = {
  comprador123: { _id: 'comprador123', email: 'comprador@test.com' },
  vendedor1: { _id: 'vendedor1', email: 'vendedor1@test.com' },
  vendedor2: { _id: 'vendedor2', email: 'vendedor2@test.com' },
};

  beforeEach(() => {
    (Pago.findById as jest.Mock).mockResolvedValue(mockPago);
    (Orden.findById as jest.Mock).mockResolvedValue(mockOrden);
    (Producto.findById as jest.Mock).mockImplementation((id: string) =>
      Promise.resolve(mockProductos.find(p => p._id === id))
    );
    (User.findById as jest.Mock).mockImplementation((id: string) =>
      Promise.resolve(mockUsuarios[id])
    );
    (emailService.enviarCorreo as jest.Mock).mockResolvedValue(true);
  });

  it('debería enviar correos a vendedor y comprador al confirmar un pago', async () => {
    const req = {
      params: { id: 'pago123' },
      user: { id: 'comprador123' },
    } as any as Request;

    await confirmarPago(req, mockRes);

    // Se debe haber llamado a enviarCorreo 3 veces (2 vendedores + 1 comprador)
    expect(emailService.enviarCorreo).toHaveBeenCalledTimes(3);

    // Verificar destinatarios
    expect(emailService.enviarCorreo).toHaveBeenCalledWith(
      expect.objectContaining({ destinatario: 'vendedor1@test.com' })
    );
    expect(emailService.enviarCorreo).toHaveBeenCalledWith(
      expect.objectContaining({ destinatario: 'vendedor2@test.com' })
    );
    expect(emailService.enviarCorreo).toHaveBeenCalledWith(
      expect.objectContaining({ destinatario: 'comprador@test.com' })
    );

    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Pago confirmado' }));
  });
});
