import * as crypto from 'crypto';
import { Knex } from 'knex';
import { Tables } from 'knex/types/tables';
import { exit } from 'process';

export interface IUser {
	name: string;
	email: string;
	permissions: UserPermissions;
	verificationCode?: string;
	verificationExpires?: string;
	password: string;
	salt: string;
	created_at?: string;
	updated_at?: string;
}

export enum UserPermissions {
	USER,
	MODERATOR,
	ADMIN,
}

export interface IUserTable {
	users: IUser;
	usersComposite: Knex.CompositeTableType<
		IUser,
		Pick<IUser, 'name'> & Partial<Pick<IUser, 'created_at' | 'updated_at'>>,
		Partial<Omit<IUser, 'id'>>
	>;
}

export async function init(knex: Knex) {
	if (!(await knex.schema.hasTable('users'))) {
		await knex.schema
			.createTable('users', (table) => {
				table.uuid('id');
				table.string('name').notNullable();
				table.string('email').notNullable();
				table
					.enu('permissions', ['USER', 'MODERATOR', 'ADMIN'])
					.defaultTo('USER');
				table.string('verificationCode');
				table.timestamp('verificationExpires');
				table.string('password');
				table.string('salt');
				table.timestamps();
				table.unique(['id', 'name', 'email']);
			})
			.then(() => {
				console.log('User table was created');
			})
			.catch((err) => {
				console.error('Failed to create user table', err);
				exit(1);
			});
	} else {
		console.debug('User table already exists');
	}
}

export function setPassword(user: IUser, password: string, cb: () => void) {
	user.salt = crypto.randomBytes(128).toString('base64');
	crypto.pbkdf2(
		password,
		user.salt,
		100000,
		64,
		'sha512',
		(err, derivedKey) => {
			if (err) {
				throw err;
			}
			user.password = derivedKey.toString('hex');
			cb();
		}
	);
}

export function checkPassword(
	user: IUser,
	password: string,
	cb: (success: boolean) => void
) {
	crypto.pbkdf2(
		password,
		user.salt,
		100000,
		64,
		'sha512',
		(err, derivedKey) => {
			if (err) {
				throw err;
			}
			cb(derivedKey.toString('hex') === user.password);
		}
	);
}
