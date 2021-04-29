import { ResearchConsumer, Simulation } from 'enigma-common';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Knex } from 'knex';
import HttpError from '../config/error';
import knexInstance from '../models/db';
import { IPlayer, PlayerModel } from '../models/player.model';
import { IPlayerTech, TechModel } from '../models/tech.model';
import { IUser } from '../models/user.model';
import { PlayerView } from '../views/player.view';
import { TechView } from '../views/tech.view';

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

		const researchConsumer = new ResearchConsumer(
			tech.map((t) => new TechView(t))
		);
		const simulation = new Simulation(
			new PlayerView(player),
			player.calculated_at,
			[researchConsumer]
		).run();

		GameController.updatePlayerData(player, tech, simulation, researchConsumer);

		next();
	};

	private static updatePlayerData(
		player: IPlayer,
		tech: IPlayerTech[],
		simulation: Simulation,
		researchConsumer: ResearchConsumer
	) {
		player.calculated_at = simulation.calculatedAt;
		player.money = simulation.player.money;
		player.science = simulation.player.science;
		player.industry = simulation.player.industry;
		player.food = simulation.player.food;

		researchConsumer.research.forEach((r) => {
			const playerTech = tech.find((t) => (t.tech_id = r.id));
			if (playerTech) {
				TechView.fromTechView(r).applyTo(playerTech);
			}
		});
	}
}
