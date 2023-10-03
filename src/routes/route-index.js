import { Router } from 'express';
import routerCart from './products/route-cart.js';
import routerProducts from '../routes/products/route-product.js';


const router = Router();

    //Routes
router.use('/api/productos', routerProducts);
router.use('/api/carrito', routerCart)


export default router;