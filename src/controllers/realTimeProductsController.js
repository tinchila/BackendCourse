import productAPI from '../API/products.js';
import { io } from '../index.js';

const renderRealTimeProducts = async (req, res) => {
    try {
        const allProducts = await productAPI.getAll();

        // Pasa los productos a la vista realTimeProducts
        res.render('realTimeProducts', { products: allProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cargar los productos' });
    }
};

const handleAddProduct = async (req, res) => {
    const newProduct = req.body;
    
    io.emit('productAdded', { product: newProduct });

    res.status(201).json({ message: 'Producto agregado correctamente' });
};



export { renderRealTimeProducts, handleAddProduct };
