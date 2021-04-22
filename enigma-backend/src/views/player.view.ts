import { IPlayer } from '../models/player.model';
import { View } from './view';

export interface IPlayerView {
	money: number;
	moneyCapacity: number;

	science: number;
	scienceCapacity: number;

	industry: number;
	industryCapacity: number;

	energy: number;

	food: number;
	foodCapacity: number;
}

export class PlayerView extends View<IPlayer> implements IPlayerView {
	money!: number;
	moneyCapacity!: number;

	science!: number;
	scienceCapacity!: number;

	industry!: number;
	industryCapacity!: number;

	energy!: number;

	food!: number;
	foodCapacity!: number;

	constructor(player: IPlayer) {
		super(player);
	}

	protected fromModle(model: IPlayer): void {
		this.money = Math.floor(model.money);
		this.moneyCapacity = model.money_capacity;

		this.science = Math.floor(model.science);
		this.scienceCapacity = model.science_capacity;

		this.industry = Math.floor(model.industry);
		this.industryCapacity = model.industry_capacity;

		this.energy = model.energy;

		this.food = Math.floor(model.food);
		this.foodCapacity = model.food_capacity;
	}
}
