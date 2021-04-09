module.exports = {
	development: {
		client: 'pg',
		connection: process.env.DATABASE_URL,
	},

	production: {
		client: 'postgresql',
		connection: {
			connectionString: process.env.DATABASE_URL,
			ssl: {
				rejectUnauthorized: false,
			},
		},
	},
};
