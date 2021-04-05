import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ITile } from '../enigma-common/tile/tile.component';

export interface IMapTile extends ITile {
  position: ITilePosition;
  entities: IMapEntity[];
}

export interface ITilePosition {
  x: number;
  y: number;
}

export interface IMapEntity {
  type: EntityTyp;
}

export enum EntityTyp {
  PLAYER,
  PLANET,
  SUN,
  SPACE_STATION,
  ANOMALY,
}

@Injectable()
export class MapService {
  mapCache: IMapTile[][] = [[]];

  constructor() {}

  public getMap(x: number, y: number): Observable<IMapTile[][]> {
    const tiles: IMapTile[][] = [];
    const height = 10;
    const width = 10;
    for (let i = 0; i < height; i++) {
      const tileRow: IMapTile[] = [];
      const yPos = y - height / 2 + i;
      for (let j = 0; j < width; j++) {
        tileRow.push(this.getEmpty(x - width / 2 + j, yPos));
      }
      if (i % 2 === 0) {
        if (yPos % 2 === 0) {
          tileRow.unshift(this.getEmpty(x - width / 2 - 1, yPos));
        } else {
          tileRow.push(this.getEmpty(x + width / 2 + 1, yPos));
        }
      }
      tiles.push(tileRow);
    }
    console.log(tiles);
    return of(tiles);
  }

  private getEmpty(x: number, y: number): IMapTile {
    const tile: IMapTile = {
      entities: [],
      image: '',
      position: { x, y },
    };

    if (Math.abs((x * y) % 42) === 7) {
      tile.entities.push({ type: EntityTyp.PLANET });
    }

    return tile;
  }
}
