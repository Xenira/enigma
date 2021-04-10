export interface ITech {
	id: number; // Don't change IDs later. Need to be unique
	name: string;
	description: string;
	cost: number;
	dependencies: ITech[];
	tier: ITechTier;
	image?: string;
}

export interface ITechTier {
	index: 0;
	name: string;
	description: string;
}

export const T0: ITechTier = {
	index: 0,
	name: 'T0',
	description: 'The first steps',
};

export const THomeBuildPermits: ITech = {
	id: 0,
	name: 'Home World Build Permits',
	description:
		'Home Sweeet Home. Allows you to start expending your Home World.',
	cost: 1,
	dependencies: [],
	tier: T0,
};

export const TSolarCells: ITech = {
	id: 1,
	name: 'Solar Cells',
	description: 'Solar cells are a great clean energy source.',
	cost: 2,
	dependencies: [THomeBuildPermits],
	tier: T0,
};

export const TManufacturingFacilities: ITech = {
	id: 2,
	name: 'Manufacturing Facilities',
	description: 'tbd',
	cost: 2,
	dependencies: [THomeBuildPermits],
	tier: T0,
};

export const TPodConstruction: ITech = {
	id: 3,
	name: 'Pod Construction',
	description:
		'It might not be a fully fleged Space Ship, but still better than going by foot.',
	cost: 5,
	dependencies: [TManufacturingFacilities],
	tier: T0,
};

export const TechList = [
	THomeBuildPermits,
	TSolarCells,
	TManufacturingFacilities,
	TPodConstruction,
];

export const TechListById: { [key: number]: ITech } = TechList.reduce(
	(prev: { [key: number]: ITech }, curr) => {
		prev[curr.id] = curr;
		return prev;
	},
	{}
);
