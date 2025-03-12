import { Router } from 'express';
import { login, perfil, register, logout } from '../controllers/usuarios';
import { getProductos, getProducto, crearProducto, editarProducto, eliminarProducto, buscarProductos, productosPorCategoria } from '../controllers/Productos';
import { verCarrito, agregarAlCarrito, eliminarDelCarrito, comprar, historialCompras } from '../controllers/Carrito';
import { getUsuarios, eliminarUsuario, getProductosReportados, eliminarProductoAdmin } from '../controllers/Admin';
import { checkout, confirmarPago, historialPagos } from '../controllers/Pagos';
import { authenticateToken } from '../middlewares/auth';
import { role } from '../middlewares/role';
import {Roles} from '../types/roles'

const router = Router();

// Autenticación y Usuarios
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', authenticateToken, logout);
router.get('/auth/perfil', authenticateToken, perfil);
router.patch('/auth/perfil', authenticateToken, perfil); // Actualizar perfil
router.delete('/auth/eliminar-cuenta', authenticateToken, perfil); // Eliminar cuenta

// Gestión de Productos
router.get('/productos', getProductos);
router.get('/productos/:id', getProducto);
router.post('/productos', authenticateToken, crearProducto);
router.patch('/productos/:id', authenticateToken, editarProducto);
router.delete('/productos/:id', authenticateToken, eliminarProducto);
router.get('/productos/categoria/:categoria', productosPorCategoria);
router.get('/productos/busqueda', buscarProductos);

// Compras y Carrito
router.get('/carrito', authenticateToken, verCarrito);
router.post('/carrito/agregar', authenticateToken, agregarAlCarrito);
router.delete('/carrito/eliminar/:id', authenticateToken, eliminarDelCarrito);
router.post('/comprar', authenticateToken, comprar);
router.get('/compras/historial', authenticateToken, historialCompras);

// Administración (Admin)
router.get('/admin/usuarios',  role([Roles.ADMIN]), getUsuarios);
router.delete('/admin/usuarios/:id',  role([Roles.ADMIN]), eliminarUsuario);
router.get('/admin/productos-reportados',  role([Roles.ADMIN]), getProductosReportados);
router.delete('/admin/productos/:id',  role([Roles.ADMIN]), eliminarProductoAdmin);

// Pagos (Stripe y Shopify API)
router.post('/pagos/checkout', authenticateToken, checkout);
router.get('/pagos/confirmar/:id', authenticateToken, confirmarPago);
router.get('/pagos/historial', authenticateToken, historialPagos);

export default router;
