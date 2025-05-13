import { Router } from 'express';

// Importación de subrutas por módulo
import usuarioRoutes from './usuarios';
import productoRoutes from './productos';
import categoriaRoutes from './categorias';
import ordenRoutes from './ordenes';
import detalleOrdenRoutes from './detalleordenes';
import pagoRoutes from './pagos';
import reporteRoutes from './reportes';
import carritoRoutes from './carrito';
import adminRoutes from './admin';
import fileRoutes from './fileRoutes';
import googleRoutes from './google.routes';

const router = Router();

// Rutas agrupadas por módulo
router.use('/auth', usuarioRoutes);
router.use('/productos', productoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/ordenes', ordenRoutes);
router.use('/detalles-orden', detalleOrdenRoutes);
router.use('/pagos', pagoRoutes);
router.use('/reportes', reporteRoutes);
router.use('/carrito', carritoRoutes);
router.use('/admin', adminRoutes);
router.use('/files', fileRoutes);
router.use('/auth',googleRoutes);

export default router;
