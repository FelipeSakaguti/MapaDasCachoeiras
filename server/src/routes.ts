import express from 'express';
import { celebrate, Joi } from 'celebrate';

import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsController';
import CaracsController from './controllers/CaracsController';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const caracsController = new CaracsController();

//index, show, create, update, delete

routes.get('/caracs', caracsController.index)

routes.get('/points/:id',  pointsController.show)
routes.get('/points', pointsController.index);
routes.post(
    '/points', 
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            caracs: Joi.string().required(),
        })
    },{
        abortEarly: false
    }),
    pointsController.create);

export default routes;