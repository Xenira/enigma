export interface ITech {
	id: number; // Don't change IDs later. Need to be unique
	name: string;
	description: string;
	cost: number;
	dependencies: ITech[];
	tier: ITechTier;
	image?: string;
	complete?: boolean;
	researching?: boolean;
}

export interface ITechTier {
	index: number;
	name: string;
	description: string;
}

export interface ITechView extends Omit<ITech, 'dependencies'> {
	progress?: number;
	dependencies: number[];
	finishedAt?: Date;
}
