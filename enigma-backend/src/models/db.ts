import knex, { Knex } from 'knex';
import { init } from './user.model';

const config: Knex.Config = {
	client: 'pg',
	connection: process.env.DATABASE_URL,
};

const knexInstance = knex(config);

init(knexInstance);

export default knexInstance;
