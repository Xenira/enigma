import knexInstance, { ITimestamps } from './db';
import * as uuid from 'uuid';
import moment from 'moment';

export const PlayerTable = 'players';

export interface IPlayer extends ITimestamps {
	id: string;
	user_id: string;
	money: number;
	money_capacity: number;
	money_production: number;
	money_updated: Date;

	science: number;
	science_capacity: number;
	science_production: number;
	science_updated: Date;

	industry: number;
	industry_capacity: number;
	industry_production: number;
	industry_updated: Date;

	energy: number;

	food: number;
	food_capacity: number;
	food_production: number;
	food_updated: Date;
}

export const getPlayer = async (userId: string): Promise<IPlayer> => {
	let player = await knexInstance(PlayerTable).first().where('user_id', userId);
	if (!player) {
		console.info('Creating player data for user', userId);
		const inserted = await knexInstance(PlayerTable)
			.insert({ id: uuid.v4(), user_id: userId })
			.returning('id');
		if (inserted.length !== 1) {
			console.error('Player data for user', userId, 'not created!');
			throw Error('Failed to create player data');
		}

		player = await knexInstance(PlayerTable).first().where('id', inserted[0]);
		if (!player) {
			throw Error('Failed to create player data');
		}
	}
	await simulatePlayerRessources(player);
	return player;
};

const updatePlayer = async (player: IPlayer) => {
	player.updated_at = moment().toDate();
	await knexInstance(PlayerTable).update(player).where('id', player.id);
};

const simulatePlayerRessources = async (player: IPlayer) => {
	const moneyUpdate = simulate(
		player.money,
		player.money_capacity,
		player.money_production,
		moment(player.money_updated),
		moment()
	);
	player.money = moneyUpdate.newValue;
	player.money_updated = moneyUpdate.updated.toDate();

	const scienceUpdate = simulate(
		player.science,
		player.science_capacity,
		player.science_production,
		moment(player.science_updated),
		moment()
	);
	player.science = scienceUpdate.newValue;
	player.science_updated = scienceUpdate.updated.toDate();

	const industryUpdate = simulate(
		player.industry,
		player.industry_capacity,
		player.industry_production,
		moment(player.industry_updated),
		moment()
	);
	player.industry = industryUpdate.newValue;
	player.industry_updated = industryUpdate.updated.toDate();

	const foodUpdate = simulate(
		player.food,
		player.food_capacity,
		player.food_production,
		moment(player.food_updated),
		moment()
	);
	player.food = foodUpdate.newValue;
	player.food_updated = foodUpdate.updated.toDate();

	await updatePlayer(player);
};

const simulate = (
	current: number,
	capacity: number,
	production: number,
	lastUpdated: moment.Moment,
	target: moment.Moment
): { newValue: number; updated: moment.Moment } => {
	const minutes = target.diff(lastUpdated, 'minutes');
	console.log(minutes);
	return {
		newValue: Math.max(0, Math.min(capacity, current + production * minutes)),
		updated: lastUpdated.add(minutes, 'minutes'),
	};
};
