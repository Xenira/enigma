import { ITech, ITechTier } from 'enigma-common';

export const T0: ITechTier = {
	index: 0,
	name: 'T0',
	description: 'The first steps',
};

export const T1: ITechTier = {
	index: 1,
	name: 'T0',
	description: 'Getting started',
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
	cost: 3,
	dependencies: [THomeBuildPermits],
	tier: T0,
};

export const TManufacturingFacilities: ITech = {
	id: 2,
	name: 'Manufacturing Facilities',
	description: 'tbd',
	cost: 3,
	dependencies: [THomeBuildPermits],
	tier: T0,
};

export const TSmallLaboratory: ITech = {
	id: 3,
	name: 'Small Laboratory',
	description: 'tbd',
	cost: 3,
	dependencies: [THomeBuildPermits],
	tier: T0,
};

export const TPodConstruction: ITech = {
	id: 4,
	name: 'Pod Construction',
	description:
		'It might not be a fully fleged Space Ship, but still better than going by foot.',
	cost: 5,
	dependencies: [TManufacturingFacilities],
	tier: T1,
};

export const TRecroutingOffice: ITech = {
	id: 5,
	name: 'Recrouting Office',
	description: 'Space travel for dummies.',
	cost: 5,
	dependencies: [TSmallLaboratory, TManufacturingFacilities],
	tier: T1,
};

export const TTrainingCenter: ITech = {
	id: 6,
	name: 'Training center',
	description: 'Space travel for dummies.',
	cost: 5,
	dependencies: [TRecroutingOffice],
	tier: T1,
};

export const TechList = [
	THomeBuildPermits,
	TSolarCells,
	TManufacturingFacilities,
	TSmallLaboratory,
	TPodConstruction,
	TRecroutingOffice,
	TTrainingCenter,
];

export const TechListById: { [key: number]: ITech } = TechList.reduce(
	(prev: { [key: number]: ITech }, curr) => {
		if (prev[curr.id]) {
			throw new Error(
				`Duplicate tech id ${curr.id}. First match '${
					prev[curr.id].name
				}', second match '${curr.name}'`
			);
		}
		prev[curr.id] = curr;
		return prev;
	},
	{}
);
