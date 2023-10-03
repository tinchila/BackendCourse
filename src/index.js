import express from 'express';
import http from 'http';
import path from 'path';
import router from './routes/route-index.js';

const app = express();
const httpServer = http.createServer(app);

// Middlewares
app.use(express.json());

// Define la ruta al directorio 'public'
const publicPath = path.resolve(new URL(import.meta.url).pathname, 'public');
app.use(express.static(publicPath));

// Routes
app.use('/', router);

// Middleware de errores de ruta
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
