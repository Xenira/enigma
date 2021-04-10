import { Knex } from 'knex';
import { IPlayer } from './player.model';
import { IPlayerTech } from './tech.model';
import { IUser } from './user.model';

type UpdatedAt = { updated_at: Date };

declare module 'knex/types/tables' {
	interface Tables {
		users: Knex.CompositeTableType<
			IUser,
			Pick<IUser, 'id' | 'name' | 'email' | 'password' | 'salt'>,
			Partial<Omit<IUser, 'id'>> & UpdatedAt
		>;
		players: Knex.CompositeTableType<
			IPlayer,
			Pick<IPlayer, 'id' | 'user_id'>,
			Partial<Omit<IPlayer, 'id' | 'user_id'>> & UpdatedAt
		>;
		player_techs: Knex.CompositeTableType<
			IPlayerTech,
			Pick<IPlayerTech, 'id' | 'player_id'>,
			Partial<Omit<IPlayer, 'id'>> & UpdatedAt
		>;
	}
}
