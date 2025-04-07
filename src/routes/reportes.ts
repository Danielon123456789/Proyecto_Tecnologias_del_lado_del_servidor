import { Router } from 'express';
import {
  crearReporte,
  getReportes,
  getReporte,
  resolverReporte,
  eliminarReporte
} from '../controllers/Reporte';
import { authenticateToken } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isadmin';

const router = Router();

/**
 * @swagger
 * /reportes:
 *   post:
 *     description: Permite a un usuario reportar un producto por razones específicas.
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               producto_reportado_id:
 *                 type: string
 *                 example: "6612f91ee8e9378b48774f44"
 *               razon:
 *                 type: string
 *                 example: "Producto ofensivo o fraudulento"
 *             required:
 *               - producto_reportado_id
 *               - razon
 *     responses:
 *       201:
 *         description: Reporte creado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.post('/', authenticateToken, crearReporte);

/**
 * @swagger
 * /reportes:
 *   get:
 *     description: Obtiene todos los reportes generados en el sistema (solo admin).
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reportes
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
router.get('/', authenticateToken, isAdmin, getReportes);

/**
 * @swagger
 * /reportes/{id}/resolver:
 *   patch:
 *     description: Marca un reporte como resuelto (solo admin).
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del reporte a resolver
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reporte resuelto
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Reporte no encontrado
 *       500:
 *         description: Error al resolver el reporte
 */
router.patch('/:id/resolver', authenticateToken, isAdmin, resolverReporte);

/**
 * @swagger
 * /reportes/{id}:
 *   get:
 *     description: Obtiene un reporte específico por su ID (solo admin).
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del reporte
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del reporte
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Reporte no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.get('/:id', authenticateToken, isAdmin, getReporte);

/**
 * @swagger
 * /reportes/{id}:
 *   delete:
 *     description: Elimina un reporte del sistema (solo admin).
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del reporte a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reporte eliminado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Reporte no encontrado
 *       500:
 *         description: Error al eliminar el reporte
 */
router.delete('/:id', authenticateToken, isAdmin, eliminarReporte);

export default router;
