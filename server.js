import express from 'express';
import { urlencoded, json } from 'express';
import cors from 'cors';

import PageRouter from './routers/PageRouter.js';

const app = express();

app.use([ urlencoded({ extended: false }), json() ]);

app.use('*', (req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Appname', 'WebAR-Testing');

    console.log(`(${req.ip}) [${req.method}] ${req.originalUrl}`);

    next();
});

app.use('/', PageRouter);
app.use(express.static('public'));

app.use('*', (req, res) => {
    res.status(403).send('<h1>403 FORBIDDEN</h1>');
});

let port = process.env.PORT || 80;
app.listen(port, () => console.log(`Server running...`));
console.log();