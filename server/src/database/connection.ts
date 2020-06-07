import knex from 'knex';
import path from 'path';

const connection = knex ({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite'),
    },
    useNullAsDefault: true,
});

export default connection;



//Points - pontos de cachus
//      -image
//      -name
//      -latitude
//      -longitude
//      -city
//      -uf
//Itens -> Caracteristicas (Facil Acesso, Lago (nadar), Alta Queda d'agua, Local Bonito)
//      -title
//      -image
//points_caracs (tabela pivot entre as duas)
//      -point_id
//      -carac_id

//Funcionalidades
//--Cadastro
//--Lista as caracateristicas
//--Listar Pontos Filtrado por estado/cidade/caracs
//--Listar um ponto especifico