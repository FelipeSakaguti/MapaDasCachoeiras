import Knex from 'knex';

export async function seed(knex: Knex){
    await knex('caracs').insert([
        { title: 'Facil acesso', image: 'easyAccess.svg'},
        { title: 'Queda Alta', image: 'highFall.svg'},
        { title: 'Lago', image: 'lake.svg'},
        { title: 'Bonita', image: 'pretty.svg'}
    ])
}


//Facil Acesso, Lago (nadar), Alta Queda d'agua, Local Bonito