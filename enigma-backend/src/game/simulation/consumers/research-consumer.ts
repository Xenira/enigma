import Decimal from 'decimal.js';
import { IRessources } from 'enigma-common';
import { DateTime } from 'luxon';
import { IPlayerTech } from '../../../models/tech.model';
import { TechListById } from '../../../ressources/tech.ressource';
import { Consumer } from './consumer';

export class ResearchConsumer extends Consumer {
	private _research: IPlayerTech[] = [];
	set research(value: IPlayerTech[]) {
		this._research = value.filter((r) => r.researching);
	}
	get research(): IPlayerTech[] {
		return this._research.filter((r) => r.researching);
	}

	constructor(research: IPlayerTech[]) {
		super();
		this.research = research;
	}

	getMinutes(): Decimal {
		return this.research.reduce((prev: Decimal, curr) => {
			const time = this.calculateTime(curr);
			if (prev.isNaN || time.lt(prev)) {
				return time;
			}
			return prev;
		}, new Decimal(NaN));
	}

	getConsumption(minutes: Decimal): Partial<IRessources> {
		return {
			science: minutes.mul(this.research.length ? 1 : 0),
		};
	}

	consume(minutes: Decimal, ressources: IRessources): Partial<IRessources> {
		const normalConsumption = this.getConsumption(minutes).science;
		const consumption: Partial<IRessources> = {};
		if (!normalConsumption) {
			return consumption;
		}

		const currentResearch = this.research;
		currentResearch.forEach((r) => {
			const tech = TechListById[r.tech_id];
			const researchConsumption = Decimal.min(
				Decimal.min(
					normalConsumption,
					ressources.science.div(normalConsumption)
				).mul(new Decimal(1).div(currentResearch.length)),
				new Decimal(tech.cost).minus(r.progress || 0),
				ressources.science
			);

			consumption.science = researchConsumption.add(consumption.science || 0);
			r.progress = Decimal.min(
				researchConsumption.add(r.progress || 0),
				tech.cost
			).toNumber();

			if (r.progress >= tech.cost) {
				r.complete = true;
				r.researching = false;
				r.finished_at = new Date();
			}
		});

		return consumption;
	}

	private calculateTime(research: IPlayerTech): Decimal {
		const tech = TechListById[research.tech_id];

		return Decimal.max(
			new Decimal(0),
			new Decimal(tech.cost).minus(research.progress || 0)
		).toDP(2, Decimal.ROUND_CEIL);
	}
}
