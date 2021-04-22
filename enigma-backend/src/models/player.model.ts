import knexInstance, { ITimestamps } from './db';
import * as uuid from 'uuid';
import moment from 'moment';

export const PlayerTable = 'players';

export interface IPlayer extends ITimestamps {
	id: string;
	user_id: string;
	money: number;
	money_capacity: number;

	science: number;
	science_capacity: number;

	industry: number;
	industry_capacity: number;

	energy: number;

	food: number;
	food_capacity: number;

	calculated_at: Date;
}

export class PlayerModel {
	constructor(private knex = knexInstance) {}

	public async getPlayer(
		userId: string,
		forUpdate?: boolean
	): Promise<IPlayer> {
		let playerSelect = this.knex(PlayerTable).first().where('user_id', userId);
		if (forUpdate) {
			playerSelect = playerSelect.forUpdate();
		}
		let player = await playerSelect;
		if (!player) {
			console.info('Creating player data for user', userId);
			const inserted = await this.knex(PlayerTable)
				.insert({ id: uuid.v4(), user_id: userId })
				.returning('id');
			if (inserted.length !== 1) {
				console.error('Player data for user', userId, 'not created!');
				throw Error('Failed to create player data');
			}

			playerSelect = this.knex(PlayerTable).first().where('id', inserted[0]);
			if (forUpdate) {
				playerSelect = playerSelect.forUpdate();
			}
			player = await playerSelect;
			if (!player) {
				throw Error('Failed to create player data');
			}
		}

		return player;
	}

	public async updatePlayer(player: IPlayer) {
		player.updated_at = moment().toDate();
		await this.knex(PlayerTable).update(player).where('id', player.id);
	}
}
