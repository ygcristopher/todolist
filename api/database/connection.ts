import knex from 'knex';

const knexInstance = knex({
    client: 'mysql2',
    connection: {
      host : '127.0.0.1',
      user : 'todolist',
      password : 'todolist',
      database : 'todolist'
    }
});

export default knexInstance;