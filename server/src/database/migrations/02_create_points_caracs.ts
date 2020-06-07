import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('points_caracs', table =>{
        table.increments('id_points_caracs').primary();
        table.integer('id_points')
            .notNullable()
            .references('id_points')
            .inTable('points');
        table.integer('id_caracs')
            .notNullable()
            .references('id_caracs')
            .inTable('caracs');
    });
}

export async function down(knex: Knex){
    return knex.schema.dropTable('points_caracs');
}