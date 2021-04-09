import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface IPlanet {
  name: string;
  id: string;
}

export interface IPlanetDetails extends IPlanet {
  buildings: IBuilding[];
}

export interface IBuilding {
  type: BuildingType;
  name: string;
  production: number;
  energy: number;
}

export enum BuildingType {
  EMPTY,
  FOOD,
  ENERGY,
  INDUSTRY,
  SCIENCE,
}

const EMPTY_BUILDING: IBuilding = {
  type: BuildingType.EMPTY,
  name: '',
  production: 0,
  energy: 0,
};

@Injectable({
  providedIn: 'root',
})
export class PlanetService {
  constructor() {}

  public getPlanets(): Observable<IPlanet[]> {
    return of<IPlanet[]>([
      {
        name: 'Foo-Bar',
        id: '42',
      },
      {
        name: 'Baz',
        id: '12',
      },
    ]);
  }

  public getPlanet(id: string): Observable<IPlanetDetails> {
    return of<IPlanetDetails>({
      name: 'Foo-Bar',
      id,
      buildings: [
        {
          type: BuildingType.ENERGY,
          name: 'Solar Cells',
          production: 10,
          energy: 0,
        },
        {
          type: BuildingType.FOOD,
          name: 'Automated Farm',
          production: 4,
          energy: 3,
        },
        EMPTY_BUILDING,
        EMPTY_BUILDING,
        EMPTY_BUILDING,
        EMPTY_BUILDING,
        EMPTY_BUILDING,
        EMPTY_BUILDING,
        EMPTY_BUILDING,
        EMPTY_BUILDING,
        EMPTY_BUILDING,
        EMPTY_BUILDING,
      ],
    });
  }
}
