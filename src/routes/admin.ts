import { Router } from 'express';
import {
  getUsuarios,
  eliminarUsuario,
  getProductosReportados,
  eliminarProductoAdmin
} from '../controllers/Admin';
import { authenticateToken } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isadmin';

const router = Router();

/**
 * @swagger
 * /admin/usuarios:
 *   get:
 *     description: Obtiene un listado de todos los usuarios (solo admin).
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   email:
 *                     type: string
 *                   rol:
 *                     type: string
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No es administrador
 *       500:
 *         description: Error en el servidor
 */
router.get('/usuarios', authenticateToken, isAdmin, getUsuarios);

/**
 * @swagger
 * /admin/usuarios/{id}:
 *   delete:
 *     description: Elimina un usuario específico por su ID (solo admin).
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No es administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/usuarios/:id', authenticateToken, isAdmin, eliminarUsuario);

/**
 * @swagger
 * /admin/productos-reportados:
 *   get:
 *     description: Obtiene un listado de productos reportados (solo admin).
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos reportados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   producto_reportado_id:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       titulo:
 *                         type: string
 *                       descripcion:
 *                         type: string
 *                   usuario_reportado_id:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nombre:
 *                         type: string
 *                   razon:
 *                     type: string
 *                   resuelto:
 *                     type: boolean
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No es administrador
 *       500:
 *         description: Error en el servidor
 */
router.get('/productos-reportados', authenticateToken, isAdmin, getProductosReportados);

/**
 * @swagger
 * /admin/productos/{id}:
 *   delete:
 *     description: Elimina un producto como administrador (por reporte u otra razón).
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No es administrador
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/productos/:id', authenticateToken, isAdmin, eliminarProductoAdmin);

export default router;
