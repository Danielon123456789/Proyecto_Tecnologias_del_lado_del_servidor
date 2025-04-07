import { Router } from 'express';
import {
  crearProducto,
  getProductos,
  getProducto,
  editarProducto,
  eliminarProducto,
  productosPorCategoria,
  buscarProductos
} from '../controllers/Productos';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /productos:
 *   get:
 *     description: Obtiene un listado de todos los productos.
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos
 *       500:
 *         description: Error en el servidor
 */
router.get('/', getProductos);

/**
 * @swagger
 * /productos/busqueda:
 *   get:
 *     description: Busca productos por texto, precio o categoría.
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *       - in: query
 *         name: min
 *         schema:
 *           type: number
 *       - in: query
 *         name: max
 *         schema:
 *           type: number
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Productos encontrados
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error en el servidor
 */
router.get('/busqueda', buscarProductos);

/**
 * @swagger
 * /productos/categoria/{categoria}:
 *   get:
 *     description: Obtiene productos filtrados por categoría.
 *     tags:
 *       - Productos
 *     parameters:
 *       - name: categoria
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID o nombre de categoría
 *     responses:
 *       200:
 *         description: Productos encontrados
 *       404:
 *         description: No se encontraron productos
 */
router.get('/categoria/:categoria', productosPorCategoria);

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     description: Obtiene un producto específico por su ID.
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', getProducto);

/**
 * @swagger
 * /productos:
 *   post:
 *     description: Crea un nuevo producto (solo usuarios autenticados).
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               categoria_id:
 *                 type: string
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - titulo
 *               - descripcion
 *               - precio
 *               - categoria_id
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateToken, crearProducto);

/**
 * @swagger
 * /productos/{id}:
 *   patch:
 *     description: Actualiza un producto existente.
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del producto
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 */
router.patch('/:id', authenticateToken, editarProducto);

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     description: Elimina un producto.
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del producto
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', authenticateToken, eliminarProducto);

export default router;
