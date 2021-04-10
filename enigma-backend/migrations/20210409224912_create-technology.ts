import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema
		.createTable('players', function (table) {
			table.uuid('id').primary();
			table.uuid('user_id').notNullable();
			table.integer('money').notNullable().defaultTo(100);
			table.integer('money_capacity').notNullable().defaultTo(1000);
			table.integer('money_production').notNullable().defaultTo(0);
			table.timestamp('money_updated').notNullable().defaultTo(knex.fn.now());
			table.integer('science').notNullable().defaultTo(10);
			table.integer('science_capacity').notNullable().defaultTo(100);
			table.integer('science_production').notNullable().defaultTo(0);
			table.timestamp('science_updated').notNullable().defaultTo(knex.fn.now());
			table.integer('energy').notNullable().defaultTo(10);
			table.integer('industry').notNullable().defaultTo(10);
			table.integer('industry_capacity').notNullable().defaultTo(100);
			table.integer('industry_production').notNullable().defaultTo(0);
			table
				.timestamp('industry_updated')
				.notNullable()
				.defaultTo(knex.fn.now());
			table.integer('food').notNullable().defaultTo(0);
			table.integer('food_capacity').notNullable().defaultTo(100);
			table.integer('food_production').notNullable().defaultTo(0);
			table.timestamp('food_updated').notNullable().defaultTo(knex.fn.now());
			table.timestamps(false, true);
			table.foreign('user_id').references('id').inTable('users');
		})
		.createTable('player_techs', function (table) {
			table.uuid('id').primary();
			table.uuid('user_id').notNullable();
			table.integer('tech_id').notNullable();
			table.integer('progress').defaultTo(0);
			table.timestamp('progress_updated').defaultTo(knex.fn.now());
			table.timestamps(false, true);
			table.foreign('user_id').references('id').inTable('users');
			table.unique(['id']);
			table.unique(['user_id', 'tech_id']);
		});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('player_techs').dropTable('players');
}
