import Decimal from 'decimal.js';
import { ITech, ITechTier, ITechView } from 'enigma-common';
import { IPlayerTech } from '../models/tech.model';
import { TechListById } from '../ressources/tech.ressource';
import { View } from './view';

type TechViewType = Pick<IPlayerTech, 'tech_id' | 'progress'> &
	Partial<Pick<IPlayerTech, 'complete' | 'researching'>>;
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

	constructor(player: TechViewType) {
		super(player);
	}

	protected fromModle(model: TechViewType): void {
		this.id = model.tech_id;
		this.progress = new Decimal(model.progress || 0).toDP(2).toNumber();
		this.complete = model.complete;
		this.researching = model.researching;

		const tech = TechListById[this.id];
		this.cost = tech.cost;
		this.dependencies = tech.dependencies.map((d) => d.id);
		this.description = tech.description;
		this.image = tech.image;
		this.name = tech.name;
		this.tier = tech.tier;
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
