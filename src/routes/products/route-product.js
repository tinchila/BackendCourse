import { Router } from 'express';
import product from '../../API/products.js';
import multer from 'multer';
import { Server } from 'socket.io';
import { httpServer } from '../index.js';

const io = new Server(httpServer);
const router = Router();

// Subir Archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post('/', adminOrClient, upload.single('thumbnail'), async (req, res) => {
  try {
    const uploadedFile = req.file;
    const productNew = req.body;
    const addProduct = await product.save(productNew);
    io.emit('productAdded', { product: addProduct });

    return res.json({ agregado: addProduct, file: uploadedFile });
  } catch (error) {
    console.log(error);
  }
});


// Middlewares
const existProduct = async function (req, res, next) {
  const allProducts = await product.getAll();
  for (const i of allProducts) {
    if (i.id === Number(req.params.id)) {
      return next();
    }
  }
  next('error');
};

const noProductError = async function (err, req, res, next) {
  if (err) {
    return res
      .status(500)
      .json({ error: ` producto con el id ${req.params.id} no encontrado` });
  }
  next();
};

const isAdmin = true;

function adminOrClient(req, res, next) {
  if (!isAdmin) {
    res.json({
      error: -1,
      descripcion: `ruta '${req.originalUrl}' metodo '${req.method}' no autorizada `,
    });
  } else {
    next();
  }
}

router.get('/:id?', async (req, res) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      let allProducts = await product.getAll();
      return res.json({ allProducts });
    }
    let idProduct = await product.getById(id);
    return res.json({ idProduct });
  } catch (error) {
    console.log(error);
  }
});

// Agregar Producto
router.post('/', adminOrClient, async (req, res) => {
  try {
    const productNew = req.body;
    const addProduct = await product.save(productNew);
    return res.json({ agregado: addProduct });
  } catch (error) {
    console.log(error);
  }
});

// Actualizar Producto
router.put(
  '/:id',
  adminOrClient,
  existProduct,
  noProductError,
  async (req, res) => {
    try {
      const { id } = req.params;
      const newProduct = req.body;
      console.log(newProduct);
      const obj = {
        ...newProduct,
        id: Number(id),
      };
      console.log(obj);
      let productUpload = await product.update(obj);
      res.json({ productUpload });
    } catch (error) {
      console.log(error);
    }
  }
);

// Eliminar Producto
router.delete(
  '/:id',
  adminOrClient,
  existProduct,
  noProductError,
  async (req, res) => {
    try {
      const { id } = req.params;
      let productDelete = await product.deleteById(Number(id));
      return res.json({ Productos: productDelete });
    } catch (error) {
      console.log(error);
    }
  }
);

export default router;
