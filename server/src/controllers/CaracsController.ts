import{ Request, Response } from 'express';
import knex from '../database/connection';

class CaracsController {
    async index(request: Request, response: Response){
        const items = await knex('caracs').select('*');
    
        const serializedItems = items.map(item => {
            return {
                id: item.id_caracs,
                title: item.title,
                image_url: `http://192.168.15.66:3333/uploads/${item.image}`
            };
        });
    
        return response.json(serializedItems);
    }
}

export default CaracsController;