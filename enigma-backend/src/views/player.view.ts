import { IPlayer } from '../models/player.model';
import { View } from './view';

export interface IPlayerView {
	money: number;
	moneyCapacity: number;
	moneyProduction: number;

	science: number;
	scienceCapacity: number;
	scienceProduction: number;

	industry: number;
	industryCapacity: number;
	industryProduction: number;

	energy: number;

	food: number;
	foodCapacity: number;
	foodProduction: number;
}

export class PlayerView extends View<IPlayer> implements IPlayerView {
	money!: number;
	moneyCapacity!: number;
	moneyProduction!: number;

	science!: number;
	scienceCapacity!: number;
	scienceProduction!: number;

	industry!: number;
	industryCapacity!: number;
	industryProduction!: number;

	energy!: number;

	food!: number;
	foodCapacity!: number;
	foodProduction!: number;

	constructor(player: IPlayer) {
		super(player);
	}

	protected fromModle(model: IPlayer): void {
		this.money = model.money;
		this.moneyCapacity = model.money_capacity;
		this.moneyProduction = model.money_production;

		this.science = model.science;
		this.scienceCapacity = model.science_capacity;
		this.scienceProduction = model.science_production;

		this.industry = model.industry;
		this.industryCapacity = model.industry_capacity;
		this.industryProduction = model.industry_production;

		this.energy = model.energy;

		this.food = model.food;
		this.foodCapacity = model.food_capacity;
		this.foodProduction = model.food_production;
	}
}
