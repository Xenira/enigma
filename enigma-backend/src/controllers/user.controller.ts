import { Request, Response } from 'express';
import { check } from 'express-validator';
import * as uuid from 'uuid';

import validation from '../config/validation';
import knexInstance from '../models/db';
import { IUser, setPassword, UserPermissions } from '../models/user.model';

// POST: /register
export const register = [
	check('username').isString().trim().stripLow().escape(),
	check('email').isString().trim().isEmail().normalizeEmail(),
	check('password').isString().isLength({ min: 8 }),
	validation,
	(req: Request, res: Response) => {
		const user: IUser = {
			id: uuid.v4(),
			name: req.body.username,
			email: req.body.email,
			password: req.body.password,
			salt: '',
		};
		setPassword(user, req.body.password, () => {
			knexInstance<IUser>('users')
				.insert(user)
				.then((result) => {
					delete user.password;
					delete user.salt;
					req.login(user, (loginErr) => {
						if (loginErr) {
							console.error(
								`Error logging in user ${user.name} ${user.email}`,
								loginErr
							);
							return res.sendStatus(500);
						}
						return res.sendStatus(204);
					});
				})
				.catch((e) => {
					console.error(`Error creating user ${user.name} ${user.email}`, e);
					return res.sendStatus(500);
				});
		});
	},
];

export const getCurrentUser = [
	(req: Request, res: Response) => {
		if (!req.user) {
			return res.sendStatus(401);
		}
		const user = req.user as IUser;
		res.json({
			username: user.name,
			email: user.email,
			permissions: user.permissions,
		});
	},
];
