import { Router } from 'express';
import Cart from '../../API/cart.js';

const cart = new Cart();

const router = Router();

router.post('/', async (req, res) => {
    try {
        const cartNew = await cart.createCart();
        return res.json(cartNew);
    } catch (err) {
        console.log(err);
    }
});

router.delete('/:id/productos', async (req, res) => {
    const { id } = req.params;
    const cartDelete = await cart.deleteById(id);
    console.log(cartDelete);
    return res.json({ cartDelete });
});

router.get('/:id/productos', async (req, res) => {
    try {
        const { id } = req.params;
        const allProducts = await cart.showProducts(id);
        return res.json(allProducts);
    } catch (err) {
        console.log(err);
    }
});

router.post('/:id/productos', async (req, res) => {
    const { id } = req.params;
    const idProducts = req.body;
    const cartAdd = await cart.addProducts(id, idProducts);
    return res.json(cartAdd);
});

router.delete('/:id/productos/:id_prod', async (req, res) => {
    const { id, id_prod } = req.params;
    const delProduct = await cart.deleteProduct(id, id_prod);
    return res.json({ eliminado: delProduct });
});

export default router;

