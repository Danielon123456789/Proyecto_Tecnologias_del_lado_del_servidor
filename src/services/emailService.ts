import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function enviarCorreo({
  destinatario,
  asunto,
  cuerpoHtml,
}: {
  destinatario: string;
  asunto: string;
  cuerpoHtml: string;
}) {
  const mailOptions = {
    from: `"Ecommerce ITESO" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: asunto,
    html: cuerpoHtml,
  };

  await transporter.sendMail(mailOptions);
}