import { publicarVentaSNS } from '../../services/snsService';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const sendMock = jest.fn();

jest.mock('@aws-sdk/client-sns', () => ({
  SNSClient: jest.fn().mockImplementation(() => ({
    send: sendMock,
  })),
  PublishCommand: jest.fn().mockImplementation((input) => input),
}));

describe('snsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.env.AWS_REGION = 'us-east-1';
    process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
    process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';
    process.env.AWS_SESSION_TOKEN = 'test-session-token';
    process.env.AWS_SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:123456789012:ecommerce-iteso';
  });

  test('publica una notificación de venta con el payload esperado', async () => {
    sendMock.mockResolvedValueOnce({ MessageId: 'message-123' });

    const messageId = await publicarVentaSNS({
      sellerId: 'seller-1',
      sellerName: 'Vendedor Demo',
      sellerEmail: 'seller@iteso.mx',
      buyerId: 'buyer-1',
      buyerName: 'Comprador Demo',
      buyerEmail: 'buyer@iteso.mx',
      paymentId: 'payment-1',
      orderId: 'order-1',
      meetingPoint: 'Biblioteca ITESO',
      product: {
        id: 'product-1',
        title: 'Laptop usada',
        price: 12000,
        quantity: 1,
        total: 12000,
      },
    });

    expect(messageId).toBe('message-123');
    expect(SNSClient).toHaveBeenCalledTimes(1);
    expect(PublishCommand).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(1);

    const publishInput = sendMock.mock.calls[0][0];

    expect(publishInput.TopicArn).toBe('arn:aws:sns:us-east-1:123456789012:ecommerce-iteso');
    expect(publishInput.Subject).toBe('Venta confirmada: Laptop usada');

    const parsedMessage = JSON.parse(publishInput.Message);

    expect(parsedMessage.eventType).toBe('SALE_COMPLETED');
    expect(parsedMessage.product.title).toBe('Laptop usada');
    expect(parsedMessage.sellerEmail).toBe('seller@iteso.mx');
  });
});