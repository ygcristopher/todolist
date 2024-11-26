import knex from 'knex';

const knexInstance = knex({
    client: 'mysql2',
    connection: {
      host : '127.0.0.1',
      user : 'todolist1',
      password : 'todolist1',
      database : 'todolist1',
      port: 3307
    }
});

export default knexInstance;