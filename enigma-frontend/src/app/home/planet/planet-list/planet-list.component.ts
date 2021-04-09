import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlanet, PlanetService } from '../planet.service';

@Component({
  selector: 'enigma-planet-list',
  templateUrl: './planet-list.component.html',
  styleUrls: ['./planet-list.component.scss'],
})
export class PlanetListComponent implements OnInit {
  planets?: Observable<IPlanet[]>;

  constructor(private planetService: PlanetService) {}

  ngOnInit(): void {
    this.planets = this.planetService.getPlanets();
  }
}
