import Decimal from 'decimal.js';
import { ITech, ITechTier, ITechView } from 'enigma-common';
import { IPlayerTech } from '../models/tech.model';
import { TechListById } from '../ressources/tech.ressource';
import { View } from './view';

type TechViewType = Pick<IPlayerTech, 'tech_id' | 'progress'> &
	Partial<Pick<IPlayerTech, 'complete' | 'researching' | 'finished_at'>>;
export class TechView extends View<TechViewType> implements ITechView {
	id!: number;
	name!: string;
	description!: string;
	cost!: number;
	dependencies!: number[];
	tier!: ITechTier;
	image?: string;
	progress?: number;
	complete?: boolean;
	researching?: boolean;
	finishedAt?: Date;

	constructor(player?: TechViewType) {
		super(player);
	}

	public applyTo(playerTech: IPlayerTech) {
		playerTech.complete = this.complete || false;
		playerTech.finished_at = this.finishedAt;
		playerTech.progress = this.progress;
		playerTech.researching = this.researching || false;
	}

	protected fromModle(model: TechViewType): void {
		this.id = model.tech_id;
		this.progress = model.progress;
		this.complete = model.complete;
		this.researching = model.researching;
		this.finishedAt = model.finished_at;

		const tech = TechListById[this.id];
		this.cost = tech.cost;
		this.dependencies = tech.dependencies.map((d) => d.id);
		this.description = tech.description;
		this.image = tech.image;
		this.name = tech.name;
		this.tier = tech.tier;
	}

	public static fromTechView(techView: ITechView): TechView {
		const result = new TechView();
		result.id = techView.id;
		result.name = techView.name;
		result.description = techView.description;
		result.cost = techView.cost;
		result.dependencies = techView.dependencies;
		result.tier = techView.tier;
		result.image = techView.image;
		result.progress = techView.progress;
		result.complete = techView.complete;
		result.researching = techView.researching;
		result.finishedAt = techView.finishedAt;

		return result;
	}

	static fromTech(tech: ITech): TechView {
		return new TechView({
			tech_id: tech.id,
			progress: undefined,
			complete: undefined,
			researching: undefined,
		});
	}
}
