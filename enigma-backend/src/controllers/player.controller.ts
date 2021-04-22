import { Response, RequestHandler, NextFunction } from 'express';
import HttpError from '../config/error';
import { PlayerView } from '../views/player.view';
import { IGameRequest } from './game.controller';

export class PlayerController {
	public static getPlayerData: RequestHandler = (
		req: IGameRequest,
		res: Response,
		next: NextFunction
	) => {
		console.log('Getting player from request');
		const player = req.player;
		if (player) {
			res.json(new PlayerView(player));
		} else {
			next(new HttpError(500, 'Could not get player data'));
		}
	};
}
