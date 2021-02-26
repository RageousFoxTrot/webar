import { Router } from 'express';
import { createReadStream } from 'fs';

const PageRouter = Router();

PageRouter.get('/', (req, res) => createReadStream('index.html').pipe(res.type('text/html')));

export default PageRouter;