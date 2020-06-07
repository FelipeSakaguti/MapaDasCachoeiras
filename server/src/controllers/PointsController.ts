import {Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    async index(request: Request, response: Response){
        const { city, uf, caracs } = request.query;

        const parsedCaracs = String(caracs)
            .split(',')
            .map(item => Number(item.trim()))

        const points = await knex('points')
            .join('points_caracs','points.id_points','=','points_caracs.id_points')
            .whereIn('points_caracs.id_caracs', parsedCaracs)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.15.66:3333/uploads/${point.image}`
                };
            });
        
        return response.json(serializedPoints);
        }

    async show(request: Request, response: Response){
        const { id } = request.params;

        const point = await knex('points').where('id_points', id).first();

        if(!point){
            return response.status(400).json({ message: 'Point not found.'})
        }

        const serializedPoints = {
            ...point,
            image_url: `http://192.168.15.66:3333/uploads/${point.image}`
        };
    
        const caracs = await knex('caracs')
            .join('points_caracs', 'caracs.id_caracs','=','points_caracs.id_caracs')
            .where('points_caracs.id_points', id)
            .select('caracs.title');
        return response.json({point: serializedPoints, caracs});
    };

    async create(request: Request, response: Response){
        const { name, latitude, longitude, city, uf, caracs } = request.body;
    
        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name,
            latitude,
            longitude,
            city,
            uf
        };
    
        const insertedIDs = await trx('points').insert(point);
    
        const id_points = insertedIDs[0];
    
        const pointCaracs = caracs
            .split(',')
            .map((carac: string) => Number(carac.trim()))
            .map((id_caracs: number)=> {
            return{
                id_caracs,
                id_points,
            };
        });
    
        await trx('points_caracs').insert(pointCaracs);
        
        await trx.commit();

        return response.json({
            id: id_points,
            ...point,
        });
    };
};

export default PointsController;