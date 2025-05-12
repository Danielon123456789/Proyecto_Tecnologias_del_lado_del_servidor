import { Router } from 'express';
import {
  crearOrden,
  getTodasLasOrdenes,
  getOrdenesUsuario,
  getOrden,
  actualizarOrden,
  eliminarOrden
} from '../controllers/Orden';
import { authenticateToken } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isadmin';

const router = Router();

/**
 * @swagger
 * /ordenes:
 *   get:
 *     summary: Obtener todas las órdenes (admin)
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las órdenes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   usuario_id:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nombre:
 *                         type: string
 *                       email:
 *                         type: string
 *                   productos_id:
 *                     type: array
 *                     items:
 *                       type: string
 *                   total:
 *                     type: number
 *                   estado:
 *                     type: string
 *                   fecha_compra:
 *                     type: string
 *                   metodo_pago:
 *                     type: string
 *                   punto_encuentro:
 *                     type: string
 */

router.post('/', authenticateToken, crearOrden);

/**
 * @swagger
 * /ordenes/usuario:
 *   get:
 *     summary: Obtener las órdenes del usuario autenticado
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   usuario_id:
 *                     type: string
 *                   productos_id:
 *                     type: array
 *                     items:
 *                       type: string
 *                   total:
 *                     type: number
 *                   estado:
 *                     type: string
 *                   fecha_compra:
 *                     type: string
 *                   metodo_pago:
 *                     type: string
 *                   punto_encuentro:
 *                     type: string
 */

router.get('/usuario', authenticateToken, getOrdenesUsuario);

/**
 * @swagger
 * /ordenes/admin:
 *   get:
 *     description: Obtiene todas las órdenes del sistema (solo admin).
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las órdenes
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 *       500:
 *         description: Error en el servidor
 */
router.get('/admin', authenticateToken, isAdmin, getTodasLasOrdenes);

/**
 * @swagger
 * /ordenes/{id}:
 *   get:
 *     summary: Obtener una orden por ID
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Detalle de la orden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 usuario_id:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                 productos_id:
 *                   type: array
 *                   items:
 *                     type: string
 *                 total:
 *                   type: number
 *                 estado:
 *                   type: string
 *                 fecha_compra:
 *                   type: string
 *                 metodo_pago:
 *                   type: string
 *                 punto_encuentro:
 *                   type: string
 */

router.get('/:id', authenticateToken, getOrden);

/**
 * @swagger
 * /ordenes/{id}:
 *   patch:
 *     description: Actualiza los datos de una orden existente.
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, pagado, cancelado]
 *               metodo_pago:
 *                 type: string
 *               punto_encuentro:
 *                 type: string
 *     responses:
 *       200:
 *         description: Orden actualizada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.patch('/:id', authenticateToken, actualizarOrden);

/**
 * @swagger
 * /ordenes/{id}:
 *   delete:
 *     description: Elimina una orden existente.
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden eliminada correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.delete('/:id', authenticateToken, eliminarOrden);

export default router;
