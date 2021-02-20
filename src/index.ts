import express from 'express';
import bodyparser from 'body-parser';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

import { userRouter } from './routes/usersrouter';
import { postsRouter } from './routes/postsrouter';
import { categoriesRouter } from './routes/categoriesrouter';
import { postCategoriesRouter } from './routes/postcategoriesrouter';
import { commentsRouter } from './routes/commentsrouter';


let application = express();
let indexHTML = fs.readFileSync('src/views/index.html');

application.use(bodyparser.json());
application.options('*', cors({credentials: true, origin: true}));
application.use(express.static(path.join(process.cwd(), 'public')));
application.use(cors({credentials: true, origin: true}));

application.use(userRouter);
application.use(postsRouter);
application.use(categoriesRouter);
application.use(postCategoriesRouter);
application.use(commentsRouter);

application.use('/', (req, res, next) => {
    res.status(200).header('Content-Type', 'text/html');
    res.write(indexHTML);
    res.end();
});

application.listen(3000);