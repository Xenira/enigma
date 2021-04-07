import knex, { Knex } from 'knex';
import { init } from './user.model';

const config: Knex.Config = {
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false,
		},
	},
};

const knexInstance = knex(config);

init(knexInstance);

export default knexInstance;
