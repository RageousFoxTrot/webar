import express from 'express';
import { urlencoded, json } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import PageRouter from './routers/PageRouter.js';

const app = express();

app.use([ cors({ exposedHeaders: false, origin: process.env.HOST || '127.0.0.1', credentials: true }), helmet(), urlencoded({ extended: false }), json() ]);

app.use('*', (req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Appname', 'WebAR-Testing');

    console.log(`(${req.ip}) [${req.method}] ${req.path}`);

    next();
});

app.use('/', PageRouter);
app.use('/', express.static('public'));

app.use('*', (req, res) => {
    res.status(403).send('<h1>403 FORBIDDEN</h1>');
});

let port = 8080, host = 'localhost';
app.listen(port, host, () => console.log(`Server running @${host}:${port}`));