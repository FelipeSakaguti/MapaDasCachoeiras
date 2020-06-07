import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('caracs', table =>{
        table.increments('id_caracs').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
    });
}

export async function down(knex: Knex){
    return knex.schema.dropTable('caracs');
}