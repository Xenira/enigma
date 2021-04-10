import { Request, Response, RequestHandler, NextFunction } from 'express';
import HttpError from '../config/error';
import { getPlayer } from '../models/player.model';
import { IUser } from '../models/user.model';
import { PlayerView } from '../views/player.view';

export class PlayerController {
	public static getPlayerData: RequestHandler = (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const user = req.user as IUser;
		console.log('Getting player for user', user);
		getPlayer(user.id)
			.then((player) => {
				res.json(new PlayerView(player));
			})
			.catch((e) => {
				console.error(e);
				next(new HttpError(500, 'Could not get player data'));
			});
	};
}
