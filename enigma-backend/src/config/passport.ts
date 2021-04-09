import { Response } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import knexInstance from '../models/db';
import { checkPassword, IUser, UserWithDetails } from '../models/user.model';
import HttpError from './error';

passport.use(
	'local',
	new LocalStrategy((email, password, done) => {
		knexInstance<IUser>('users')
			.select('id', 'name', 'email', 'password', 'salt')
			.where('email', email)
			.first()
			.then((user) => {
				if (!user) {
					return done(null, false);
				}
				checkPassword(user, password, (success) => {
					delete user.password;
					delete user.salt;
					if (success) {
						return done(null, user);
					}

					return done(null, false);
				});
			})
			.catch((err) => {
				done(err);
			});
	})
);

passport.serializeUser((user: any, done) => {
	console.log('Serializing user', user, 'to', user.id);
	done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
	console.log('Deserializing user', id);
	knexInstance<IUser>('users')
		.select(UserWithDetails)
		.where('id', id)
		.first()
		.then((user) => {
			console.log('Deserialized to', user);
			done(null, user);
		})
		.catch((err) => {
			done(err, null);
		});
});

export default class Authorization {
	public static login(req: any, res: Response, next: any) {
		if (!req.account) {
			return next(new HttpError(401));
		}
		req.login(req.account, (err: any) => {
			if (err) {
				return next(new HttpError(500));
			}
			return res.sendStatus(204);
		});
	}

	public static any(req: any, res: any, next: any) {
		console.log(req.isAuthenticated());
		if (req.isAuthenticated()) {
			return next();
		}

		res.sendStatus(401);
	}
}
