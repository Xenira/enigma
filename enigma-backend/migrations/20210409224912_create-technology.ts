import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema
		.createTable('players', function (table) {
			table.uuid('id').primary();
			table.uuid('user_id').notNullable();
			table.double('money').notNullable().defaultTo(100);
			table.integer('money_capacity').notNullable().defaultTo(1000);
			table.double('science').notNullable().defaultTo(10);
			table.integer('science_capacity').notNullable().defaultTo(100);
			table.integer('energy').notNullable().defaultTo(10);
			table.double('industry').notNullable().defaultTo(10);
			table.integer('industry_capacity').notNullable().defaultTo(100);
			table.double('food').notNullable().defaultTo(0);
			table.integer('food_capacity').notNullable().defaultTo(100);
			table.timestamp('calculated_at').notNullable().defaultTo(knex.fn.now());
			table.timestamps(false, true);
			table.foreign('user_id').references('id').inTable('users');
		})
		.createTable('player_techs', function (table) {
			table.uuid('id').primary();
			table.uuid('user_id').notNullable();
			table.integer('tech_id').notNullable();
			table.boolean('complete').notNullable().defaultTo(false);
			table.boolean('researching').defaultTo(false);
			table.timestamp('started_at').nullable();
			table.timestamp('finished_at').nullable();
			table.float('progress').defaultTo(0);
			table.timestamps(false, true);
			table.foreign('user_id').references('id').inTable('users');
			table.unique(['id']);
			table.unique(['user_id', 'tech_id']);
		});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('player_techs').dropTable('players');
}
