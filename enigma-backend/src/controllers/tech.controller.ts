import { ITech } from 'enigma-common';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import HttpError from '../config/error';
import { IPlayerTech, TechModel } from '../models/tech.model';
import { IUser } from '../models/user.model';
import { TechList, TechListById } from '../ressources/tech.ressource';
import { TechView } from '../views/tech.view';
import { IGameRequest } from './game.controller';

export class TechController {
	public static getAvailableTech: RequestHandler = (
		req: IGameRequest,
		res: Response,
		next: NextFunction
	) => {
		console.log('Getting player from request');
		const tech = req.tech;
		if (tech) {
			const techViews = tech.map((t) => new TechView(t));
			const techIds = techViews.map((t) => t.id);
			const completedTechs = techViews
				.filter((t) => t.complete)
				.map((t) => t.id);

			TechList.filter((t) => !techIds.includes(t.id)).forEach((t) => {
				if (
					t.dependencies.length === 0 ||
					t.dependencies.some((dep) => completedTechs.includes(dep.id))
				) {
					techViews.push(TechView.fromTech(t));
				}
			});

			res.json(techViews);
		} else {
			next(new HttpError(500, 'Could not get player data'));
		}
		const user = req.user as IUser;
		console.log('Getting player techs for user', user);
	};

	public static startResearch: RequestHandler = (
		req: IGameRequest,
		res: Response
	) => {
		const user = req.user as IUser;
		const id = Number(req.params.id);

		if (Number.isNaN(id) || !TechListById[id]) {
			return res.sendStatus(404);
		}

		const userTechs = req.tech;
		if (!userTechs) {
			throw new HttpError(500, 'Unable to load player tech');
		}

		const tech = TechListById[id];
		if (TechController.canLearn(tech, userTechs)) {
			TechController.startResearchProject(tech, userTechs, user.id);
			return res.sendStatus(204);
		}
		res.sendStatus(403);
	};

	private static canLearn(tech: ITech, userTechs: IPlayerTech[]): boolean {
		const finishedTechs = userTechs
			.filter((ut) => ut.complete)
			.map((ut) => TechListById[ut.tech_id]);
		return tech.dependencies.every((dep) => finishedTechs.includes(dep));
	}

	private static startResearchProject(
		tech: ITech,
		userTechs: IPlayerTech[],
		userId: string
	): void {
		let isNewResearch = true;
		userTechs.forEach((ut) => {
			if (ut.tech_id === tech.id) {
				ut.researching = true;
				isNewResearch = false;
			} else {
				ut.researching = false;
			}
		});

		if (isNewResearch) {
			userTechs.push({
				id: '',
				user_id: userId,
				tech_id: tech.id,
				researching: true,
				complete: false,
				created_at: new Date(),
				updated_at: new Date(),
			});
		}
	}
}
