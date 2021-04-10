import knex, { Knex } from 'knex';

export interface ITimestamps {
	created_at: Date;
	updated_at: Date;
}

const config: Knex.Config = {
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
	},
};

if (process.env.PRODUCTION) {
	(config.connection as Knex.PgConnectionConfig).ssl = {
		rejectUnauthorized: false,
	};
} else {
	config.debug = !!process.env.DEBUG;
}

const knexInstance = knex(config);

console.log('Running migrations');
knexInstance.migrate
	.latest({
		loadExtensions: ['.ts', '.js'],
	})
	.then((result) => {
		console.log('Finished running migrations', result);
	})
	.catch((e) => {
		console.error('Failed to run database migrations', e);
	});

export default knexInstance;
