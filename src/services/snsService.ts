import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

type AwsCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
};

export interface SaleNotificationProduct {
  id: string;
  title: string;
  price: number;
  quantity: number;
  total: number;
}

export interface SaleNotificationPayload {
  sellerId: string;
  sellerName: string;
  sellerEmail?: string;
  buyerId: string;
  buyerName: string;
  buyerEmail?: string;
  paymentId: string;
  orderId: string;
  meetingPoint?: string;
  product: SaleNotificationProduct;
}

let snsClient: SNSClient | null = null;

const getRegion = (): string => {
  const region = process.env.AWS_REGION;

  if (!region) {
    throw new Error('AWS_REGION no está definida en las variables de entorno');
  }

  return region;
};

const getCredentials = (): AwsCredentials | undefined => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    return undefined;
  }

  const sessionToken = process.env.AWS_SESSION_TOKEN;

  return {
    accessKeyId,
    secretAccessKey,
    ...(sessionToken ? { sessionToken } : {}),
  };
};

const getTopicArn = (): string => {
  const topicArn = process.env.AWS_SNS_TOPIC_ARN;

  if (!topicArn) {
    throw new Error('AWS_SNS_TOPIC_ARN no está definida en las variables de entorno');
  }

  return topicArn;
};

const getSnsClient = (): SNSClient => {
  if (!snsClient) {
    const credentials = getCredentials();

    snsClient = new SNSClient({
      region: getRegion(),
      ...(credentials ? { credentials } : {}),
    });
  }

  return snsClient;
};

export async function publicarVentaSNS(payload: SaleNotificationPayload): Promise<string | undefined> {
  const subject = `Venta confirmada: ${payload.product.title}`.slice(0, 100);

  const message = JSON.stringify(
    {
      eventType: 'SALE_COMPLETED',
      source: 'ecommerce-iteso-api',
      timestamp: new Date().toISOString(),
      ...payload,
    },
    null,
    2
  );

  const command = new PublishCommand({
    TopicArn: getTopicArn(),
    Subject: subject,
    Message: message,
  });

  const response = await getSnsClient().send(command);
  return response.MessageId;
}