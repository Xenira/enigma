import { Request, Response } from 'express';
import { check } from 'express-validator';

import validation from '../config/validation';
import knexInstance from '../models/db';
import { IUser, setPassword, UserPermissions } from '../models/user.model';

// POST: /register
export const register = [
	check('username').trim().isAlphanumeric(),
	check('email').trim(),
	check('password').isLength({ min: 8 }),
	validation,
	(req: Request, res: Response) => {
		const user: IUser = {
			name: req.body.username,
			email: req.body.email,
			password: req.body.password,
			permissions: UserPermissions.USER,
			salt: '',
		};
		setPassword(user, req.body.password, () => {
			knexInstance<IUser>('users')
				.insert(user)
				.then((savedUser) => {
					req.login(savedUser, (loginErr) => {
						if (loginErr) {
							return res.sendStatus(500);
						}
						return res.sendStatus(204);
					});
				})
				.catch(() => {
					return res.sendStatus(500);
				});
		});
	},
];

export const getCurrentUser = [
	(req: Request, res: Response) => {
		if (!req.user) {
			return res.sendStatus(500);
		}
		res.json({ name: (req.user as IUser).name });
	},
];
