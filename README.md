# E-TESO Backend - Tecnologías del Lado del Servidor

Backend de e-commerce con notificaciones de email vía SNS, Lambda y Nodemailer.

## 🚀 Setup

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env` en la raíz con:

```env
# Base de datos
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Servidor
PORT=3000
JWT_SECRET=tu_secret_key

# AWS (credenciales permanentes IAM)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=imagenes-backend1
AWS_SNS_TOPIC_ARN=arn:aws:sns:us-east-1:...

# Email via Gmail SMTP
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_app_password

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Session
SESSION_SECRET=un_secreto_seguro
FRONTEND_URL=http://localhost:4200
```

### 3. Generar Gmail App Password

1. Ir a https://myaccount.google.com/apppasswords (requiere 2FA habilitado)
2. Seleccionar "Mail" y "Windows Computer"
3. Copiar el password generado
4. Asignar a `EMAIL_PASS` en `.env`

### 4. Compilar TypeScript
```bash
npm run build
```

### 5. Ejecutar tests
```bash
npm test
```

## 📧 Flujo de Notificaciones

```
Backend (Express)
    ↓
SNS Topic (AWS)
    ↓
Lambda (emailNotifier)
    ↓
Nodemailer + Gmail SMTP
    ↓
Email enviado al usuario
```

### Procesos:
- **Email de confirmación**: Se envía cuando se confirma un pago
- **SNS SALE_COMPLETED**: Se publica para auditoría y notificaciones internas

## 🧪 Tests

Tests e2e reales contra base de datos:

```bash
# Todos los tests
npm test

# Test específico del flujo de pago + email + SNS
npm test -- --runInBand src/__tests__/endpoints/pagos.test.ts

# Tests de endpoints
npm test -- --runInBand src/__tests__/endpoints/
```

## 📋 Estructura del Proyecto

```
src/
├── app.ts                 # App Express
├── index.ts              # Entry point
├── models/               # Modelos Mongoose
├── routes/               # Rutas API
├── controllers/          # Lógica de negocio
├── services/             # Servicios (email, SNS)
├── middlewares/          # Middlewares
├── lambda/               # Código Lambda (emailNotifier)
└── __tests__/           # Tests e2e
    ├── endpoints/       # Tests de API
    ├── setup.ts        # Setup de tests
```

## 🔑 Credenciales AWS

**Requeridas:**
- IAM User con permisos en SNS
- Lambda Function `ecommerce-sns-email-notifier` con Nodemailer

**Nota**: Las credenciales se cargan del archivo `~/.aws/credentials` o variables de entorno

## ⚠️ Importante

- **NUNCA** commitear `.env` - está en `.gitignore`
- Las credenciales AWS no deben estar en el código
- Cada developer genera su propio Gmail App Password
- Lambda debe estar desplegado en AWS para que el flujo completo funcione

## 🚀 Deployment

Lambda se actualiza manualmente:

```bash
# Compilar
npm run build

# Crear ZIP manualmente con emailNotifier.js + nodemailer
# Subir a AWS Lambda
```

El código fuente está limpio de credenciales y listo para Git.

---

**Desarrollado por**: E-TESO Team
**Año**: 2026


🛠 CI/CD y Contenedores
GitHub Actions (.github/workflows/deploy.yml)

El flujo se dispara al realizar un push a las ramas main o nube-mongoDb.

    Build: Compila el código TypeScript.

    Dockerize: Construye la imagen usando node:20-slim e instala libcurl4 y procps.

    ECR Push: Autentica y sube la imagen a:
    541890559721.dkr.ecr.us-east-1.amazonaws.com/reuseiteso-backend:latest

Despliegue en EC2

El servidor EC2 utiliza docker-compose.yml para orquestar los servicios.

Comandos de actualización:
Bash

cd ~/app
docker-compose pull
docker-compose up -d

Configuración de docker-compose.yml:
YAML

services:
  backend:
    image: [541890559721.dkr.ecr.us-east-1.amazonaws.com/reuseiteso-backend:latest](https://541890559721.dkr.ecr.us-east-1.amazonaws.com/reuseiteso-backend:latest)
    container_name: reuseiteso-backend
    restart: unless-stopped
    env_file: .env
    networks:
      - eteso-network

🧪 Pruebas (Tests)

Los tests e2e utilizan mongodb-memory-server. Requiere libcurl4 en el entorno de ejecución (incluido en la imagen de producción).
Bash

# Ejecutar suite completa
npm test

# Test de flujo crítico (Pagos + SNS)
npm test -- --runInBand src/__tests__/endpoints/pagos.test.ts

# Ejecutar tests dentro del contenedor EC2
docker exec reuseiteso-backend npm test