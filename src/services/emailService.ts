import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

type AwsCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
};

type EmailNotificationPayload = {
  destinatario: string;
  asunto: string;
  cuerpoHtml: string;
};

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
  const topicArn = process.env.AWS_SNS_EMAIL_TOPIC_ARN ?? process.env.AWS_SNS_TOPIC_ARN;

  if (!topicArn) {
    throw new Error('AWS_SNS_EMAIL_TOPIC_ARN o AWS_SNS_TOPIC_ARN no está definida en las variables de entorno');
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

export async function enviarCorreo({ destinatario, asunto, cuerpoHtml }: EmailNotificationPayload): Promise<string | undefined> {
  const message = JSON.stringify(
    {
      notificationType: 'EMAIL_NOTIFICATION',
      source: 'ecommerce-iteso-api',
      timestamp: new Date().toISOString(),
      destinatario,
      asunto,
      cuerpoHtml,
    },
    null,
    2
  );

  const command = new PublishCommand({
    TopicArn: getTopicArn(),
    Subject: asunto.slice(0, 100),
    Message: message,
    MessageAttributes: {
      notificationType: {
        DataType: 'String',
        StringValue: 'EMAIL_NOTIFICATION',
      },
      destinatario: {
        DataType: 'String',
        StringValue: destinatario,
      },
    },
  });

  const response = await getSnsClient().send(command);
  return response.MessageId;
}