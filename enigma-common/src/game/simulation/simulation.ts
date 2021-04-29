import { Decimal } from 'decimal.js';
import { DateTime } from 'luxon';
import { IPlayerView, IRessources } from '../../interfaces';
import { Consumer } from './consumers/consumer';

export interface ISimulationResult {}

export class Simulation {
	constructor(
		public player: IPlayerView,
		public calculatedAt: Date,
		private consumers: Consumer[] = []
	) {}

	public addConsumers(...consumer: Consumer[]): Simulation {
		this.consumers.push(...consumer);
		return this;
	}

	public run(target: DateTime = DateTime.now()): Simulation {
		const lastCalculatedAt = DateTime.fromJSDate(this.calculatedAt);
		const targetMinutes = Decimal.max(
			new Decimal(0),
			new Decimal(target.diff(lastCalculatedAt, 'minutes').minutes).toDP(
				2,
				Decimal.ROUND_DOWN
			)
		);

		console.debug(
			target.diff(DateTime.fromJSDate(this.calculatedAt), 'minutes').minutes
		);
		if (targetMinutes.lte(0)) {
			console.debug(
				'Skipping simulation as time to',
				target.toISO(),
				'is',
				targetMinutes
			);
			return this;
		}
		console.debug(
			'Starting simulation for',
			targetMinutes,
			'minutes. Target time is',
			target.toISO()
		);

		let minuteCounter = new Decimal(targetMinutes);
		while (minuteCounter.gt(0)) {
			const nextTargets = this.getNextTargets();
			// TODO: Remove initial calculation
			let currentStep = minuteCounter;
			// TODO: Calculate from producers
			let production: IRessources = Ressources.of(0, 0, 0, 0);
			let ressources = this.calculateRessources(production);
			let totalRequired = this.calculateRequiredRessources(currentStep);
			let ressourceKey = this.calculateRessourceKey(ressources, totalRequired);

			for (const nextTarget of nextTargets) {
				const nextStep = Decimal.min(
					minuteCounter,
					Decimal.max(
						nextTarget.minutes.gt(0) ? nextTarget.minutes : minuteCounter,
						new Decimal(0.01)
					)
				);

				const stepProduction = Ressources.of(0, 0, 0, 0);
				const stepRessources = this.calculateRessources(stepProduction);
				const stepTotalRequired = this.calculateRequiredRessources(nextStep);
				const stepRessourceKey = this.calculateRessourceKey(
					stepRessources,
					stepTotalRequired
				);

				if (nextTarget.consumer.canUse(ressourceKey)) {
					currentStep = nextStep;
					production = stepProduction;
					ressources = stepRessources;
					totalRequired = stepTotalRequired;
					ressourceKey = stepRessourceKey;
					break;
				}
			}
			console.debug(
				'Performing simulation step of',
				currentStep,
				'minutes. Next completion is',
				nextTargets,
				'. Player before simulation is',
				this.player
			);

			console.debug(
				'With prod',
				production,
				'there are',
				ressources,
				'of',
				totalRequired,
				'ressources, resulting in',
				ressourceKey,
				'as key.'
			);

			this.consumers.forEach((c) => {
				const availableRessources = this.applyRessourceKey(
					c.getConsumption(currentStep),
					ressourceKey
				);
				const usedRessources = c.consume(currentStep, availableRessources);
				console.debug(
					'Used',
					usedRessources,
					'of',
					availableRessources,
					'for',
					c.constructor.name
				);
				this.subtractConsumptionFromProduction(production, usedRessources);
			});

			console.debug('Production after consumers', production);
			minuteCounter = minuteCounter.sub(currentStep);
			this.saveUpdatedRessourcesToPlayer(production);
			console.debug(
				'Simulation step of',
				currentStep,
				'minutes is complete.',
				minuteCounter,
				'of',
				targetMinutes,
				'left to simulate. Player after step is',
				this.player
			);
		}
		this.calculatedAt = DateTime.fromJSDate(this.calculatedAt)
			.plus({ minutes: targetMinutes.toNumber() })
			.toJSDate();
		console.debug('Finised simulation');

		return this;
	}

	private getNextTargets(): { minutes: Decimal; consumer: Consumer }[] {
		return this.consumers
			.map((c) => ({ minutes: c.getMinutes(), consumer: c }))
			.sort((a, b) => a.minutes.sub(b.minutes).toNumber());
	}

	private calculateRessources(production: IRessources): IRessources {
		return {
			money: production.money.add(this.player.money),
			science: production.science.add(this.player.science),
			industry: production.industry.add(this.player.industry),
			food: production.food.add(this.player.food),
		};
	}

	private subtractConsumptionFromProduction(
		production: IRessources,
		consumption: Partial<IRessources>
	): void {
		production.money = production.money.sub(consumption.money || 0);
		production.science = production.science.sub(consumption.science || 0);
		production.industry = production.industry.sub(consumption.industry || 0);
		production.food = production.food.sub(consumption.food || 0);
	}

	private saveUpdatedRessourcesToPlayer(production: IRessources): void {
		this.player.money = this.calculateNewRessourceValue(
			this.player.money,
			this.player.moneyCapacity,
			production.money
		).toNumber();
		this.player.science = this.calculateNewRessourceValue(
			this.player.science,
			this.player.scienceCapacity,
			production.science
		).toNumber();
		this.player.industry = this.calculateNewRessourceValue(
			this.player.industry,
			this.player.industryCapacity,
			production.industry
		).toNumber();
		this.player.food = this.calculateNewRessourceValue(
			this.player.food,
			this.player.foodCapacity,
			production.food
		).toNumber();
	}

	private calculateNewRessourceValue(
		current: number,
		capacity: number,
		production: Decimal
	): Decimal {
		if (current < capacity) {
			return Decimal.max(0, Decimal.min(capacity, production.plus(current)));
		} else if (production.gt(0)) {
			return Decimal.max(0, production.plus(current));
		}
		return new Decimal(current);
	}

	private calculateRequiredRessources(minutes: Decimal): IRessources {
		return this.consumers
			.map((c) => c.getConsumption(minutes))
			.reduce(
				(prev: IRessources, curr) => ({
					money: prev.money.plus(curr.money || 0),
					science: prev.science.plus(curr.science || 0),
					industry: prev.industry.plus(curr.industry || 0),
					food: prev.food.plus(curr.food || 0),
				}),
				Ressources.of(0, 0, 0, 0)
			);
	}

	private calculateRessourceKey(
		ressources: IRessources,
		total: IRessources
	): IRessources {
		if (
			ressources.money >= total.money &&
			ressources.science >= total.science &&
			ressources.industry >= total.industry &&
			ressources.food >= total.food
		) {
			return Ressources.of(1, 1, 1, 1);
		}

		return {
			money: Decimal.min(
				total.money.isZero() || total.money.isNaN()
					? new Decimal(1)
					: ressources.money.div(total.money),
				1
			),
			science: Decimal.min(
				total.science.isZero() || total.science.isNaN()
					? new Decimal(1)
					: ressources.science.div(total.science),
				1
			),
			industry: Decimal.min(
				total.industry.isZero() || total.industry.isNaN()
					? new Decimal(1)
					: ressources.industry.div(total.industry),
				1
			),
			food: Decimal.min(
				total.food.isZero() || total.food.isNaN()
					? new Decimal(1)
					: ressources.food.div(total.food),
				1
			),
		};
	}

	private applyRessourceKey(
		ressources: Partial<IRessources>,
		key: IRessources
	): IRessources {
		return {
			money: (ressources.money || new Decimal(0)).mul(key.money),
			science: (ressources.science || new Decimal(0)).mul(key.science),
			industry: (ressources.industry || new Decimal(0)).mul(key.industry),
			food: (ressources.food || new Decimal(0)).mul(key.food),
		};
	}
}

class Ressources {
	public static of(
		money: number | Decimal,
		science: number | Decimal,
		industry: number | Decimal,
		food: number | Decimal
	): IRessources {
		return {
			money: typeof money === 'number' ? new Decimal(money) : money,
			science: typeof science === 'number' ? new Decimal(science) : science,
			industry: typeof industry === 'number' ? new Decimal(industry) : industry,
			food: typeof food === 'number' ? new Decimal(food) : food,
		};
	}
}
