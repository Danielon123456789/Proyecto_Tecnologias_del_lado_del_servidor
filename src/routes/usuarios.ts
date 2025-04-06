import { Router } from 'express';
import {
  login,
  register,
  perfil,
  actualizarPerfil,
  eliminarCuenta,
  logout
} from '../controllers/usuarios';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     description: Registra un nuevo usuario en el sistema.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan@example.com"
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 example: "Password123"
 *             required:
 *               - nombre
 *               - email
 *               - contrasena
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: El usuario ya está registrado
 *       500:
 *         description: Error en el servidor
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: Inicia sesión de un usuario registrado.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan@example.com"
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 example: "Password123"
 *             required:
 *               - email
 *               - contrasena
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error en el servidor
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     description: Cierra la sesión del usuario autenticado.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *       401:
 *         description: No autorizado
 */
router.post('/logout', authenticateToken, logout);

/**
 * @swagger
 * /auth/perfil:
 *   get:
 *     description: Obtiene los datos del perfil del usuario autenticado.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                 email:
 *                   type: string
 *                 rol:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al obtener perfil
 */
router.get('/perfil', authenticateToken, perfil);

/**
 * @swagger
 * /auth/perfil:
 *   patch:
 *     description: Actualiza el perfil del usuario autenticado.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Nuevo Nombre"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "nuevo@example.com"
 *             required:
 *               - nombre
 *               - email
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al actualizar perfil
 */
router.patch('/perfil', authenticateToken, actualizarPerfil);

/**
 * @swagger
 * /auth/eliminar-cuenta:
 *   delete:
 *     description: Elimina la cuenta del usuario autenticado.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuenta eliminada correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al eliminar cuenta
 */
router.delete('/eliminar-cuenta', authenticateToken, eliminarCuenta);

export default router;
