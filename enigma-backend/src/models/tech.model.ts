import knexInstance, { ITimestamps } from './db';

export const PlayerTechsTable = 'player_techs';
export interface IPlayerTech extends ITimestamps {
	id: string;
	player_id: string;
	tech_id: number;
	progress?: number;
	progress_updated: Date;
}

export class TechModel {
	static async getUserTechs(userId: string): Promise<IPlayerTech[]> {
		return knexInstance(PlayerTechsTable).where('user_id', userId);
	}
}
