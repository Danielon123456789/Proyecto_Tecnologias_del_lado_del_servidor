import { Router } from 'express';
import {
  crearDetalleOrden,
  getDetallesPorOrden,
  getDetalleOrden,
  actualizarDetalleOrden,
  eliminarDetalleOrden
} from '../controllers/DetalleOrden';
import { authenticateToken } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isadmin';

const router = Router();

/**
 * @swagger
 * /detalles-orden:
 *   post:
 *     description: Crea un nuevo detalle de orden (solo admin o sistema).
 *     tags:
 *       - Detalles de Orden
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orden_id:
 *                 type: string
 *               producto_id:
 *                 type: string
 *               cantidad:
 *                 type: integer
 *               precio_unitario:
 *                 type: number
 *             required:
 *               - orden_id
 *               - producto_id
 *               - cantidad
 *               - precio_unitario
 *     responses:
 *       201:
 *         description: Detalle creado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       500:
 *         description: Error en el servidor
 */
router.post('/', authenticateToken, isAdmin, crearDetalleOrden);

/**
 * @swagger
 * /detalles-orden/orden/{orden_id}:
 *   get:
 *     description: Obtiene todos los detalles de una orden específica.
 *     tags:
 *       - Detalles de Orden
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orden_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Lista de detalles de la orden
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.get('/orden/:orden_id', authenticateToken, getDetallesPorOrden);

/**
 * @swagger
 * /detalles-orden/{id}:
 *   get:
 *     description: Obtiene un detalle de orden por su ID.
 *     tags:
 *       - Detalles de Orden
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del detalle
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle encontrado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.get('/:id', authenticateToken, getDetalleOrden);

/**
 * @swagger
 * /detalles-orden/{id}:
 *   patch:
 *     description: Actualiza un detalle de orden (solo admin).
 *     tags:
 *       - Detalles de Orden
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del detalle
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: integer
 *               precio_unitario:
 *                 type: number
 *     responses:
 *       200:
 *         description: Detalle actualizado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.patch('/:id', authenticateToken, isAdmin, actualizarDetalleOrden);

/**
 * @swagger
 * /detalles-orden/{id}:
 *   delete:
 *     description: Elimina un detalle de orden por su ID (solo admin).
 *     tags:
 *       - Detalles de Orden
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del detalle
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle eliminado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/:id', authenticateToken, isAdmin, eliminarDetalleOrden);

export default router;
