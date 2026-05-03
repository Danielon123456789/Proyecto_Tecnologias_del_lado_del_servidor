import nodemailer from 'nodemailer';

type EmailNotificationMessage = {
  notificationType?: string;
  destinatario: string;
  asunto: string;
  cuerpoHtml: string;
};

type SnsRecord = {
  Sns: {
    Message: string;
  };
};

type SnsEvent = {
  Records: SnsRecord[];
};

const sendEmail = async (notification: EmailNotificationMessage): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Ecommerce ITESO" <${process.env.EMAIL_USER}>`,
    to: notification.destinatario,
    subject: notification.asunto,
    html: notification.cuerpoHtml,
  });
};

export const handler = async (event: SnsEvent): Promise<void> => {
  for (const record of event.Records ?? []) {
    const payload = JSON.parse(record.Sns.Message) as EmailNotificationMessage;

    if (payload.notificationType !== 'EMAIL_NOTIFICATION') {
      continue;
    }

    await sendEmail(payload);
  }
};
