import { Request, RequestHandler, Response } from 'express';
import { TechModel } from '../models/tech.model';
import { IUser } from '../models/user.model';
import { TechList } from '../ressources/tech.ressource';
import { TechView } from '../views/tech.view';

export class TechController {
	public static getAvailableTech: RequestHandler = (
		req: Request,
		res: Response
	) => {
		const user = req.user as IUser;
		console.log('Getting player techs for user', user);

		TechModel.getUserTechs(user.id).then((techs) => {
			const techViews = techs.map((t) => new TechView(t));
			const techIds = techViews
				.filter((t) => t.progress === null)
				.map((t) => t.id);

			TechList.filter((t) => !techIds.includes(t.id)).forEach((t) => {
				if (
					t.dependencies.length === 0 ||
					t.dependencies.some((dep) => techIds.includes(dep.id))
				) {
					techViews.push(TechView.fromTech(t));
				}
			});

			res.json(techViews);
		});
	};
}
