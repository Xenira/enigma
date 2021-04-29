// import { IPlayer } from '../models/player.model';
// import { DateTime } from 'luxon';
// import { IPlayerTech } from '../models/tech.model';
// import { TechListById } from '../ressources/tech.ressource';
// import { ITech, IRessources } from 'enigma-common';

// export class Simulation {
// 	static async simulate(player: IPlayer, research: IPlayerTech[]) {
// 		const currentResearch = research.filter((r) => r.researching);

// 		let needsFurtherSimulation = true;
// 		while (needsFurtherSimulation) {
// 			const nextResourceDepletion: DateTime = Simulation.getNextDepletedRessource(
// 				player
// 			);
// 			const nextResearchCompletion: DateTime = Simulation.getNextResearchCompletion(
// 				currentResearch,
// 				player.science < 1 ? 0 : undefined
// 			);
// 			const target = Simulation.getSmallestDate([
// 				DateTime.now(),
// 				nextResearchCompletion,
// 				nextResourceDepletion,
// 			]);

// 			this.simulatePlayerRessources(player, target);
// 			this.simulatePlayerResearch(currentResearch, player, target);
// 		}
// 	}

// 	static calculateConsumption(research: IPlayerTech[]): IRessources {
// 		return {
// 			money: 0,
// 			science: Math.min(1, research.filter((r) => r.researching).length),
// 			industry: 0,
// 			food: 0,
// 		};
// 	}

// 	static simulatePlayerResearch(
// 		currentResearch: IPlayerTech[],
// 		player: IPlayer,
// 		target: DateTime
// 	): void {
// 		const filteredResearch = currentResearch.filter((r) => r.researching);
// 		const baseResearchRate = 1 / filteredResearch.length;
// 		const expectedRates = filteredResearch.map((r) => {
// 			const tech: ITech = TechListById[r.tech_id];
// 			let progressUpdated = DateTime.fromJSDate(r.progress_updated);

// 			const minutes: number = Math.max(
// 				0,
// 				Math.floor(target.diff(progressUpdated, 'minutes').minutes)
// 			);

// 			const progressMade = Math.min(
// 				tech.cost - (r.progress || 0),
// 				(r.progress || 0) + baseResearchRate * minutes
// 			);

// 			return { research: r, progressMade, minutes };
// 		});

// 		const adjustedResearchRate = Math.min(
// 			baseResearchRate,
// 			player.science /
// 				expectedRates.reduce((prev, curr) => prev + curr.progressMade, 0)
// 		);
// 		expectedRates.forEach((r) => {
// 			const tech: ITech = TechListById[r.tech_id];
// 			r.research.progress = Math.min(r.progressMade, tech.cost);
// 			player.science -= progressMade;

// 			if (r.research.progress === tech.cost) {
// 				r.research.researching = false;
// 				r.research.complete = true;
// 				r.research.completed_at = new Date();
// 			}

// 			progressUpdated = progressUpdated.plus({ minutes: minutes });
// 			r.progress_updated = progressUpdated.toJSDate();
// 		});
// 	}

// 	static simulatePlayerRessources(player: IPlayer, target: DateTime) {
// 		const moneyUpdate = Simulation.simulateRessources(
// 			player.money,
// 			player.money_capacity,
// 			player.money_production,
// 			DateTime.fromJSDate(player.money_updated),
// 			target
// 		);
// 		player.money = moneyUpdate.newValue;
// 		player.money_updated = moneyUpdate.updated.toJSDate();

// 		const scienceUpdate = Simulation.simulateRessources(
// 			player.science,
// 			player.science_capacity,
// 			player.science_production,
// 			DateTime.fromJSDate(player.science_updated),
// 			target
// 		);
// 		player.science = scienceUpdate.newValue;
// 		player.science_updated = scienceUpdate.updated.toJSDate();

// 		const industryUpdate = Simulation.simulateRessources(
// 			player.industry,
// 			player.industry_capacity,
// 			player.industry_production,
// 			DateTime.fromJSDate(player.industry_updated),
// 			target
// 		);
// 		player.industry = industryUpdate.newValue;
// 		player.industry_updated = industryUpdate.updated.toJSDate();

// 		const foodUpdate = Simulation.simulateRessources(
// 			player.food,
// 			player.food_capacity,
// 			player.food_production,
// 			DateTime.fromJSDate(player.food_updated),
// 			target
// 		);
// 		player.food = foodUpdate.newValue;
// 		player.food_updated = foodUpdate.updated.toJSDate();
// 	}

// 	private static getNextResearchCompletion(
// 		acitiveResearch: IPlayerTech[],
// 		scienceProduction?: number
// 	): DateTime {
// 		if (scienceProduction !== undefined && scienceProduction <= 0) {
// 			return DateTime.invalid('Science production is 0 or less');
// 		}

// 		const filteredResearch = acitiveResearch.filter((r) => r.researching);
// 		const researchRate =
// 			(scienceProduction === undefined ? 1 : scienceProduction) /
// 			filteredResearch.length;
// 		const dates: DateTime[] = filteredResearch.map((r) =>
// 			DateTime.fromJSDate(r.progress_updated).plus({
// 				minutes: Math.abs(
// 					(TechListById[r.tech_id].cost - (r.progress || 0)) / researchRate
// 				),
// 			})
// 		);

// 		if (dates.length === 0) {
// 			return DateTime.invalid('No Research will finish');
// 		}

// 		return Simulation.getSmallestDate(dates);
// 	}

// 	private static getNextDepletedRessource(player: IPlayer): DateTime {
// 		const dates: DateTime[] = [];
// 		if (player.money > 0 && player.money_production < 0) {
// 			dates.push(
// 				DateTime.fromJSDate(player.money_updated).plus({
// 					minutes: player.money / -player.money_production,
// 				})
// 			);
// 		}
// 		if (player.science > 0 && player.science_production < 0) {
// 			dates.push(
// 				DateTime.fromJSDate(player.science_updated).plus({
// 					minutes: player.science / -player.science_production,
// 				})
// 			);
// 		}
// 		if (player.industry > 0 && player.industry_production < 0) {
// 			dates.push(
// 				DateTime.fromJSDate(player.industry_updated).plus({
// 					minutes: player.industry / -player.industry_production,
// 				})
// 			);
// 		}
// 		if (player.food > 0 && player.food_production < 0) {
// 			dates.push(
// 				DateTime.fromJSDate(player.food_updated).plus({
// 					minutes: player.food / -player.food_production,
// 				})
// 			);
// 		}

// 		if (dates.length === 0) {
// 			return DateTime.invalid('No Ressource will be depleted');
// 		}

// 		return Simulation.getSmallestDate(dates);
// 	}

// 	private static simulateRessources(
// 		current: number,
// 		capacity: number,
// 		production: number,
// 		lastUpdated: DateTime,
// 		target: DateTime
// 	): { newValue: number; updated: DateTime } {
// 		const diffInMinutes = Math.floor(
// 			target.diff(lastUpdated, 'minutes').minutes
// 		);
// 		const newValue = Math.max(
// 			0,
// 			Math.min(capacity, current + production * diffInMinutes)
// 		);

// 		return {
// 			newValue,
// 			updated: lastUpdated.plus({ minutes: diffInMinutes }),
// 		};
// 	}

// 	private static getSmallestDate(dates: DateTime[]): DateTime {
// 		return dates
// 			.filter((dt) => dt.isValid)
// 			.reduce((prev, curr) => {
// 				if (prev === null || prev > curr) {
// 					return curr;
// 				} else {
// 					return prev;
// 				}
// 			});
// 	}
// }
