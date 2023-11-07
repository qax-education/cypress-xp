import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';

import OrphanagesController from './controllers/OrphanagesController';

const routes = Router();
const upload = multer(uploadConfig)

routes.get('/orphanages', OrphanagesController.index);
routes.get('/orphanages/:_id', OrphanagesController.show);
routes.post('/orphanages', upload.array('images'), OrphanagesController.create);

routes.delete('/helper/orphanages', OrphanagesController.removeByName);

export default routes;
