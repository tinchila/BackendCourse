import productAPI from '../API/products.js';

const renderHome = async (req, res) => {
    try {
        const allProducts = await productAPI.getAll();

        res.render('home', { products: allProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cargar los productos' });
    }
};

const handleAddProduct = async (req, res, io) => {
    try {
        // Agregar un producto
        const newProduct = { };

        io.emit('productAdded', { product: newProduct });

        res.status(201).json({ message: 'Producto agregado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar un producto' });
    }
};

export { renderHome, handleAddProduct };
