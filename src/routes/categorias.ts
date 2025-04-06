import { Router } from 'express';
import {
  crearCategoria,
  getCategorias,
  getCategoria,
  editarCategoria,
  eliminarCategoria
} from '../controllers/Categorias';
import { authenticateToken } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isadmin';

const router = Router();

/**
 * @swagger
 * /categorias:
 *   post:
 *     description: Crea una nueva categoría (solo admin).
 *     tags:
 *       - Categorías
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
 *                 example: "Electrónicos"
 *             required:
 *               - nombre
 *     responses:
 *       201:
 *         description: Categoría creada correctamente
 *       400:
 *         description: La categoría ya existe
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 *       500:
 *         description: Error en el servidor
 */
router.post('/', authenticateToken, isAdmin, crearCategoria);

/**
 * @swagger
 * /categorias:
 *   get:
 *     description: Obtiene un listado de todas las categorías.
 *     tags:
 *       - Categorías
 *     responses:
 *       200:
 *         description: Lista de categorías
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
 *       500:
 *         description: Error en el servidor
 */
router.get('/', getCategorias);

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     description: Obtiene una categoría por su ID.
 *     tags:
 *       - Categorías
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nombre:
 *                   type: string
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.get('/:id', getCategoria);

/**
 * @swagger
 * /categorias/{id}:
 *   patch:
 *     description: Actualiza el nombre de una categoría existente (solo admin).
 *     tags:
 *       - Categorías
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a editar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Ropa"
 *             required:
 *               - nombre
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.patch('/:id', authenticateToken, isAdmin, editarCategoria);

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     description: Elimina una categoría por su ID (solo admin).
 *     tags:
 *       - Categorías
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.delete('/:id', authenticateToken, isAdmin, eliminarCategoria);

export default router;
