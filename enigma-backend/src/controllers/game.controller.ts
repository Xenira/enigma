import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Knex } from 'knex';
import HttpError from '../config/error';
import { ResearchConsumer } from '../game/simulation/consumers/research-consumer';
import { Simulation } from '../game/simulation/simulation';
import knexInstance from '../models/db';
import { IPlayer, PlayerModel } from '../models/player.model';
import { IPlayerTech, TechModel } from '../models/tech.model';
import { IUser } from '../models/user.model';

export interface IGameRequest extends Request {
	player?: IPlayer;
	tech?: IPlayerTech[];
	trx?: Knex.Transaction;
}

export class GameController {
	public static loadPlayerData: RequestHandler = async (
		req: IGameRequest,
		res: Response,
		next: NextFunction
	) => {
		const user = req.user as IUser;

		const trx = await knexInstance.transaction();
		req.trx = trx;
		const techModel = new TechModel(trx);
		const playerModel = new PlayerModel(trx);

		const getPlayer = playerModel
			.getPlayer(user.id)
			.then((player) => (req.player = player));
		const getTech = techModel
			.getUserTechs(user.id, undefined, true)
			.then((tech) => (req.tech = tech));

		Promise.all([getPlayer, getTech])
			.then(() => next())
			.catch((e) => next(new HttpError(500, 'Failed to load player data', e)));

		res.once('error', () => trx.rollback());
		res.once('finish', async () => {
			if (!req.player) {
				console.error(
					'Failed to save player data as object is no longer present on request object.'
				);
				trx.rollback();
				throw new HttpError(500, 'Failed to save player data');
			}
			await playerModel.updatePlayer(req.player);
			if (!req.tech) {
				console.error(
					'Failed to save player data as object is no longer present on request object.'
				);
				trx.rollback();
				throw new HttpError(500, 'Failed to save player research');
			}
			await techModel.updateTech(req.tech);
			trx.commit();
		});
	};

	public static simulate: RequestHandler = (
		req: IGameRequest,
		res: Response,
		next: NextFunction
	) => {
		const player = req.player;
		const tech = req.tech;
		if (!player || !tech) {
			console.error(
				'Failed to load player data from request. Make sure GameController#loadPlayerData middleware is used.'
			);
			return next(new HttpError(500, 'Failed to load player data'));
		}

		const researchConsumer = new ResearchConsumer(tech);
		new Simulation(player, [researchConsumer]).run();
		next();
	};
}
