import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface IPlayerData {
  name: string;
  shekel: IRessource;
  energy: IRessource;
  science: IRessource;
  food: IRessource;
  industry: IRessource;
  crystals: IRessource;
}

export interface IRessource {
  current: number;
  production?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor() {}

  public getPlayerData(): Observable<IPlayerData> {
    return of<IPlayerData>({
      name: 'ripπ',
      shekel: {
        current: 420,
        production: -42,
      },
      energy: {
        current: 42,
      },
      crystals: {
        current: 42,
        production: 12,
      },
      food: {
        current: 3,
        production: 0,
      },
      industry: {
        current: 0,
        production: 12,
      },
      science: {
        current: 42,
        production: 42,
      },
    });
  }
}
