import { IPlayerTech } from '../models/tech.model';
import { ITech, ITechTier, TechListById } from '../ressources/tech.ressource';
import { View } from './view';

export interface ITechView extends Omit<ITech, 'dependencies'> {
	progress?: number;
	dependencies: number[];
}

export class TechView
	extends View<Pick<IPlayerTech, 'tech_id' | 'progress'>>
	implements ITechView {
	id!: number;
	name!: string;
	description!: string;
	cost!: number;
	dependencies!: number[];
	tier!: ITechTier;
	image?: string;
	progress?: number;

	constructor(player: Pick<IPlayerTech, 'tech_id' | 'progress'>) {
		super(player);
	}

	protected fromModle(model: Pick<IPlayerTech, 'tech_id' | 'progress'>): void {
		this.id = model.tech_id;
		this.progress = model.progress;

		const tech = TechListById[this.id];
		this.cost = tech.cost;
		this.dependencies = tech.dependencies.map((d) => d.id);
		this.description = tech.description;
		this.image = tech.image;
		this.name = tech.name;
		this.tier = tech.tier;
	}

	static fromTech(tech: ITech): TechView {
		return new TechView({ tech_id: tech.id, progress: undefined });
	}
}
