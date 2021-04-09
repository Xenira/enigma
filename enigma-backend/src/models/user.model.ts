import * as crypto from 'crypto';
import { Knex } from 'knex';

export const UserWithoutDetails = ['name', 'email', 'permissions'];
export const UserWithDetails = [
	'id',
	...UserWithoutDetails,
	'verificationCode',
	'verificationExpires',
	'created_at',
	'updated_at',
];
export interface IUser {
	id: string;
	name: string;
	email: string;
	permissions?: UserPermissions;
	verificationCode?: string;
	verificationExpires?: string;
	password?: string;
	salt?: string;
	created_at?: string;
	updated_at?: string;
}

export enum UserPermissions {
	UNCONFIRMED = 'UNCONFIRMED',
	USER = 'USER',
	MODERATOR = 'MODERATOR',
	ADMIN = 'ADMIN',
}

export interface IUserTable {
	users: IUser;
	usersComposite: Knex.CompositeTableType<
		IUser,
		Pick<IUser, 'name'> & Partial<Pick<IUser, 'created_at' | 'updated_at'>>,
		Partial<Omit<IUser, 'id'>>
	>;
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
	if (!user.salt) {
		console.warn('User', user.name, 'is missing salt');
		return cb(false);
	}
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
