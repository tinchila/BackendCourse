
'use strict'

import express from 'express';
import http from 'http';
import path from 'path';
import router from './routes/route-index.js';

const app = express();
const httpServer = http.createServer(app);

// Middlewares
app.use(express.json());

// Ruta al Directorio PUBLIC
const publicPath = path.resolve(new URL(import.meta.url).pathname, 'public');
app.use(express.static(publicPath));

// Routes
app.use('/', router);

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

console.log('Hello World!')

