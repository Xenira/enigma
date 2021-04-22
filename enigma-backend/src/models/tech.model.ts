import { ITech } from 'enigma-common';
import knexInstance, { ITimestamps } from './db';
import * as uuid from 'uuid';
import { IPlayer } from './player.model';

export const PlayerTechsTable = 'player_techs';
export interface IPlayerTech extends ITimestamps {
	id: string;
	user_id: string;
	tech_id: number;
	complete: boolean;
	started_at?: Date;
	finished_at?: Date;
	researching: boolean;
	progress?: number;
}

export class TechModel {
	constructor(private knex = knexInstance) {}

	async getUserTechs(
		userId: string,
		active?: boolean,
		forUpdate?: boolean
	): Promise<IPlayerTech[]> {
		let query = this.knex(PlayerTechsTable).where('user_id', userId);

		if (forUpdate) {
			query = query.forUpdate();
		}

		if (active !== undefined) {
			return query.andWhere('researching', active);
		}

		return query;
	}

	async canLearn(userId: string, tech: ITech): Promise<boolean> {
		if (tech.dependencies.length === 0) {
			return Promise.resolve(true);
		}
		const techCount: { cnt: string } = ((await this.knex(PlayerTechsTable)
			.first()
			.count('tech_id as cnt')
			.where('user_id', userId)
			.andWhere('complete', true)
			.and.whereIn(
				'tech_id',
				tech.dependencies.map((d) => d.id)
			)) as unknown) as { cnt: string };

		return parseInt(techCount.cnt) === tech.dependencies.length;
	}

	async updateTech(tech: IPlayerTech[]) {
		await this.knex.transaction(async (trx) => {
			await Promise.all(
				tech.map((t) => {
					if (t.id) {
						return trx(PlayerTechsTable).update(t).where('id', t.id);
					} else {
						return trx(PlayerTechsTable).insert({
							...t,
							id: uuid.v4(),
						}) as Promise<unknown>;
					}
				})
			);
		});
	}
}
