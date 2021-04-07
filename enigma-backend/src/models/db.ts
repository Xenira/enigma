import knex, { Knex } from 'knex';
import { init } from './user.model';

const config: Knex.Config = {
	client: 'pg',
	connection: {
		host: process.env.PG_HOST,
		user: process.env.PG_USER,
		password: process.env.PG_PASSWORD,
		database: process.env.PG_DATABASE,
	},
	// connection:
	// 	'user=postgres;Password=mysecretpassword;Server=postgres;Port=5432;Database=postgres;Pooling=true', //process.env.PG_CONNECTION_STRING,
};

const knexInstance = knex(config);

init(knexInstance);

export default knexInstance;
