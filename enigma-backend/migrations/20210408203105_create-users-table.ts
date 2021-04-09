import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('users', function (table) {
		table.uuid('id').primary();
		table.string('name').notNullable();
		table.string('email').notNullable();
		table
			.enu('permissions', ['UNCONFIRMED', 'USER', 'MODERATOR', 'ADMIN'])
			.defaultTo('UNCONFIRMED');
		table.string('verificationCode');
		table.timestamp('verificationExpires');
		table.string('password');
		table.string('salt');
		table.timestamps(false, true);
		table.unique(['id']);
		table.unique(['name']);
		table.unique(['email']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('users');
}
