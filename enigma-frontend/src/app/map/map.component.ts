import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityTyp, IMapTile, ITilePosition, MapService } from './map.service';

@Component({
  selector: 'enigma-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  position?: ITilePosition;
  tiles?: Observable<IMapTile[][]>;
  entityTpes = EntityTyp;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.move({ x: 1, y: 2 });
  }

  move(position: ITilePosition): void {
    this.position = position;
    this.tiles = this.mapService.getMap(this.position.x, this.position.y);
  }
}
