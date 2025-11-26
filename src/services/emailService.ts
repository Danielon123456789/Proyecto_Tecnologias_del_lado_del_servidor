import nodemailer from 'nodemailer';

// Security Review (SonarQube):
// nodemailer con Gmail utiliza TLS/SSL por defecto.
// No se transmiten datos sensibles sin cifrado y las credenciales vienen de variables de entorno.
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