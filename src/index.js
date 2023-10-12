import express from 'express';
import http from 'http';
import path from 'path';
import router from './routes/route-index.js';
import exphbs from 'express-handlebars';
import { Server } from 'socket.io';
import { renderHome, handleAddProduct } from './controllers/homeController.js';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Middlewares
app.use(express.json());

// Ruta al Directorio PUBLIC
const publicPath = path.resolve(new URL(import.meta.url).pathname, 'public');
app.use(express.static(publicPath));

// Configuración de Handlebars y rutas
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// Routes

app.use('/', router);

app.get('/', (req, res) => {
    renderHome(req, res);
});

app.post('/add-product', (req, res) => {
    handleAddProduct(req, res, io);
});

// Middleware de Errores de Ruta
const routeError = (req, res) => {
    console.log(req);
    return res.status(404).json({ error: -2, description: `Route '${req.originalUrl}' method '${req.method}' not implemented` });
};

app.use('/*', routeError);

// Running Server
const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});

export { httpServer, io };